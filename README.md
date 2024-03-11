# fly-src

A flight tickets service. [Original task](#original-task) definition.

# How to run

**Pre-requisites:**

- Node.js `>=18.x`

**Initialise**

Install the dependencies.

```sh
$ npm install
```

Postinstall script also does basic initialisation: create, seed DB and generate Prisma types.

**Run the app**

In dev mode, with watch:

```sh
$ npm run dev
```

In prod mode:

```sh
$ npm run start
```

# Approach

> [!NOTE]
> The main idea: we are pre-fetching the tickets and then fetch it again asynchronously every a bit less than 1 hour, so the data keeps being fresh.
> We also store the `bestBefore` DateTime column for every item, so we can easily check if the data is stale at the time of the request.
> The web API is just a simple select from the DB, lazily cached.

**Detailed**

First time tickets are fetched during the app initialization (`onModuleInit`), and then schedule re-fetching every 55 minutes: just a bit less than a TTL to be able to refresh.
The property TTL time is configurable in DB `PowerusTask` table.

- There is a concept of **vendors**: a vendor is a service that fetches the data from a specific source. It's a simple async function that returns an array of `APITicket` items.
- Currently there is only one vendor: `src/vendorPowerUs`. Vendor also contains all the normalisation logic.
- `SchedulerService` is quite abstract, so it's only responsibility is to periodically call a "task": an object containing async `run` function with some retry logic parameters.
- The `TaskerService` is a glue layer between `SchedulerService` a **vendors**. It is responsible for calling a vendor (fetching the data) and saving results to the DB. `TaskerService` can also be used to schedule cleanup stale data. Not implemented, though.
- Web API: a basic select from the DB, roughtly: `SELECT * FROM tickets WHERE bestBefore > now()`. This is how we make sure that no stale data is returned to the client. Result is cached with a TTL of minimal `bestBefore - now()`.
- `bestBefore` is also returned in the response, so the client can decide whether it needs to refresh the data or not if it becomes stale since the request is made.

# Response time

An excerpt from logs:

All items:

```
VERBOSE [RootController] [all-tickets] Setting cache for 3578861 ms, until: 2024-03-10T23:27:33.003Z. Response time: 10.111 ms.
VERBOSE [RootController] [all-tickets] Read from cache. Response time: 0.313 ms.
VERBOSE [RootController] [all-tickets] Read from cache. Response time: 0.164 ms.
```

One item

```
VERBOSE [RootController] Read ticket 456d42825f.
VERBOSE [RootController] [ticket/456d42825f] Setting cache for 3575026 ms, until: 2024-03-10T23:27:33.013Z. Response time: 2.654 ms.
VERBOSE [RootController] [ticket/456d42825f] Read from cache. Response time: 0.060 ms.
VERBOSE [RootController] [ticket/456d42825f] Read from cache. Response time: 0.038 ms.
```

These are "internal" times. For the end-user it adds 5 to 15 ms. With "cold" cache, it's around 30-40 ms on my laptop.

## Implementation details

> [!NOTE]
> It's my first time using NestJS, so some implementation details may be not quite idiomatic or implemented easier.

**Naming**

- flights item → `Ticket`
- item's `Slice` → `TicketFlight`

It's a matter of taste, but to me this sounds a bit more clear.

**Storage**

`Prisma` with `SQLite` → easy to switch to a "real" DB (e.g. Postgres).

**NX**

A monorepo orchestrator.

Currently there is only one "app" and it's `server`.
NX here is just to show the structure, but it's easy to add more apps, e.g. `web–client`, `mobile-app`, etc or libs: e.g. `vendors`.
Vendors could be extracted to a separate package for a better separation of concerns.
All we need is to have an async function, returning a specific type of data. `TaskerService` will handle saving it to the DB and reset the cache.

One more nice feature of the `NX` is the tasks dependency graph + task cache.
It's easy to configure task's dependency: e.g. `start` depends on `build`, so one don't need to manually run build. It also handles a cache to the task, so it's not executed if it's not necessary: if no source is changed and we have it built, it will be ignored.

**Cache**

The API that is serving the tickets is simply either reads from cache or fetches the tickets from the DB and then caches them.

**ID**

An ID is generated as a first 10 chars of `sha1` hash of a string.

For a single slice / flight:

- `flight_number`
- `departure_date_time_utc`
- `origin_name`
- `destination_name`

For a ticket: a combined data of all flights in the ticket.
See [normaliseFlightResponse.ts](./apps/server/src/vendorPowerUs/normaliseFlightResponse.ts) for details.

**OpenAPI / Swagger**

Is accessible at [/api/docs](http://localhost:3000/api/docs)

**TODO Improvements**

- More tests: dockerised postgres or sqlite for tests
- Collect metrics
- Use postgres with docker
- Deployment / publish scripts
- Extend CI/CD
- Data cleanup
- More detailed logger logic / management
- Cache:
  - fine-tuned caching (e.g. Redis)
  - update the strategy: cache keys, different cache service instances, etc.
- DB switching: e.g. `sqlite` for local testing, `postgres` for prod.
- Cron for scheduler so scheduler can be a separate app
- Infra management (e.g. Terraform or Pulumi)
- pre-commit hooks
- better linting / formatting
- Add / remove / update scheduler tasks dynamically (e.g. via API)

**Alternative implementation**

There is also an older and more static version that is using a simple in-memory storage for the tickets.
Since it's not very "scalable" and not feasible for a larger data, it's only available as an "alternative implementation" in the [`mg/no-db`](https://github.com/maxim-grishaev/fly-src/tree/mg/no-db) branch.
But it's very fast for simple cases, does not require cache, as the storage is itself basically a cache.

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
