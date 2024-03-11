# fly-src

A flight tickets service. [Original task](#original-task) definition.

# How to run

**Pre-requisites:**

- Node.js `20.x`

I think it should work with `18.x` too, just not tested.

**Initialise**

Install the dependencies and with "postinstall" task also does basic initialisation: create, seed DB and generate Prisma types.

```sh
npm install
```

**Run the app**

In dev mode (with wanch):

```sh
npm run dev
```

In prod mode:

```sh
npm run start:prod
```

# Approach

The whole app can be thought as 2 "main" parts:

**1. Scheduler**

First time fetching tickets during the app initialization, and then re-fetching tickets every 55 minutes: just a bit less than a TTL to be able to refresh.
I've added a property for every item: `bestBefore` = `fetchedAt` time + `TTL` (1h, configurable).

Consists of 2 services: `SchedulerService` and `TaskerService`.

- `SchedulerService` is quite abstract, so it's only responsibility is to periodically call a "task": an async function with some congigured retry logic.
- The `TaskerService` is a glue layer between `vendors` and `SchedulerService`. It's responsible for calling a vendor (fetching the data) and saving results to the DB. `TaskerService` can also be used to schedule cleanup stale data. Not implemented, though.

**2. Selection API**

A basic select from thwe DB, roughtly:

- `SELECT * FROM tickets WHERE bestBefore > now()`

This is how we make sure that no stale data is returned to the client. It's also returned in the response, so the client can decide whether it needs to refresh the data or not (if it becomes stale after the request is made).

No more complex logic => the response time is very low.

# Response time

An excerpt from logs:

```
[Nest] 23514  - 03/10/2024, 11:27:33 PM     LOG [NestApplication] Nest application successfully started +2ms
[Nest] 23514  - 03/10/2024, 11:27:54 PM VERBOSE [TicketStorageService: ltm34t1d.7p] Read 8 flights
[Nest] 23514  - 03/10/2024, 11:27:54 PM VERBOSE [RootController] Read all 8 tickets. Min bestBefore: 2024-03-10T23:27:33.003Z
[Nest] 23514  - 03/10/2024, 11:27:54 PM VERBOSE [RootController] [all-tickets] Setting cache for 3578861 ms, until: 2024-03-10T23:27:33.003Z. Response time: 10.111 ms.
[Nest] 23514  - 03/10/2024, 11:27:54 PM VERBOSE [RootController] [all-tickets] Read from cache. Response time: 0.313 ms.
[Nest] 23514  - 03/10/2024, 11:27:54 PM VERBOSE [RootController] [all-tickets] Read from cache. Response time: 0.164 ms.
[Nest] 23514  - 03/10/2024, 11:27:57 PM VERBOSE [RootController] Read ticket 456d42825f.
[Nest] 23514  - 03/10/2024, 11:27:57 PM VERBOSE [RootController] [ticket/456d42825f] Setting cache for 3575026 ms, until: 2024-03-10T23:27:33.013Z. Response time: 2.654 ms.
[Nest] 23514  - 03/10/2024, 11:27:58 PM VERBOSE [RootController] [ticket/456d42825f] Read from cache. Response time: 0.060 ms.
[Nest] 23514  - 03/10/2024, 11:27:58 PM VERBOSE [RootController] [ticket/456d42825f] Read from cache. Response time: 0.038 ms.
[Nest] 23514  - 03/10/2024, 11:27:58 PM VERBOSE [RootController] [ticket/456d42825f] Read from cache. Response time: 0.055 ms.
```

These are "internal" times. For the end-user it adds 5 to 15 ms. With "cold" cache, it's around 30 ms on my laptop.

## Implementation details

> [!NOTE]
> It's my first time using NestJS, so some implementation details may be not quite idiomatic or implemented easier.

- SQLite + Prisma => easy to switch to a "real" DB

**Vendors (extensibility)**

TODO: Vendors: tasker.service + `vendorPowerUs` service for "concrete" vendor implementation.

**NX**

Currently there is only one "app" and it's `server`.
NX here is just to show the structure, but it's easy to add more apps, e.g. `web–client`, `mobile-app`, etc or libs: e.g. `vendors`.
Vendors could be extracted to a separate package for a better separation of concerns.
All we need is to have an async function, returning a specific type of data. `TaskerService` will handle saving it to the DB.

One more nice feature of the NX is the tasks dependency graph + task cache.
It's easy to configure task's dependency: e.g. `start` depends on `build`. It also handles a cache to the task, so it's not executed if it's not necessary: if no source is changed and we have it built, it will be ignored.

**Cache**

The API that is serving the tickets is simply either reads from cache or fetches the tickets from the DB and then caches them.
Scheduler also resets the cache after the successful data fetch.
TODO: cache!

**ID**

An ID is generated as a first 10 chars of `sha1` hash of a string.

For a single flight:

- `flight_number`
- `departure_date_time_utc`
- `origin_name`
- `destination_name`

For a ticket: a combined data of all flights in the ticket.

**OpenAPI / Swagger**

Is accessible at http://localhost:3000/api/docs

```ts
// apps/server/src/vendorPowerUs/normaliseFlightResponse.ts
const getSliceIdData = (s: PowerUsRespSlice) => [s.flight_number, s.departure_date_time_utc, s.origin_name, s.destination_name];

export const createTicketFlightId = (s: PowerUsRespSlice): string => createId(getSliceIdData(s).join("\n"));

export const createTicketId = (data: PowerUsRespFlight): string => {
  const allIdData = data.slices.flatMap(getSliceIdData).join("\n");
  return createId(allIdData);
};
```

**Naming**

- `Item` -> `Ticket`
- `Slice` -> `TicketFlight`

It's a matter of taste, but to me this sounds a bit more clear.

**TODO Improvements**

- More tests
- Publish
- CI/CD
- Data cleanup
- Logger logic / management
- Cache:
  - fine-tuned caching (e.g. Redis)
  - change strategy: cache keys, different cachr service instances, etc.
- Easier DB switching: `sqlite` for local testing, `postgres` for prod.
- Infra management (e.g. Terraform or Pulumi)
- pre-commit hooks
- linting
- Add / remove / update scheduler tasks dynamically (e.g. via API)

## Alternative implementation

There is also an alternative version that is using a simple in-memory storage for the tickets.
Since it's not very "scalable" and not feasible for a larger number of tickets, it's only available as an "alternative implementation" in the [`mg/no-db`](https://github.com/maxim-grishaev/fly-src/tree/mg/no-db) branch.

But it's very fast for simple cases, does not require cache, as the storage is itself basically a cache.
As-is, it returns current dataset within 1.5 to 0.5 ms.

# Original task

Please plan and implement a service in `Node.js` with any framework.

### Requirements

- Your service should get flights from these 2 routes, merge them, remove duplicates and send them to the client.
  - https://coding-challenge.powerus.de/flight/source1
  - https://coding-challenge.powerus.de/flight/source2
- As the identifier of the flight, the combination of flight numbers and dates can be used.
- The flight services above are not stable, i.e. it can sometimes fail or reply after a couple of seconds.
- The response time of your service shouldn't take longer than 1 second.
- Please write tests for your implementation.

### Details

- Think that this service will be used in a flight search page for the customers.
- There will be many other flight source services added in the future.
- We can assume any information that we get from the endpoints remains valid for an hour.
- It is always better to show more results to the end-user as much as possible, but never invalid information.
- You can upload your solution by attaching zipped files or sending the repository link through the link below.

### Expectations

- The main aim is to send a repository that has as high quality as possible.
  - Clean code, easy to read
  - Scalability
  - Simplicity
- Finishing early will not give any additional points. Please do not send the repository until you feel fully satisfied. We want to see your "best example".
  - But please do not exceed one week.
- Using NestJS as a framework and Jest for testing is a plus.
- Please provide the instructions and your notes in a readme file.
