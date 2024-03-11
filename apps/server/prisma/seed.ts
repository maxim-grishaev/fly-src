import { PrismaClient } from '@prisma/client';

const PWR_ID = 'powerUs';
const PWR_URLS = [
  'https://coding-challenge.powerus.de/flight/source1',
  'https://coding-challenge.powerus.de/flight/source2',
];

const prisma = new PrismaClient();
async function main() {
  // const currencies = await Promise.all(
  //   ['EUR', 'USD', 'GBP'].map(async currency => {
  //     const c = await prisma.currency.upsert({
  //       where: { id: currency },
  //       update: {},
  //       create: { id: currency },
  //     });
  //     return c;
  //   }),
  // );
  // console.log('Currencies seeded:', currencies);

  const vnd = await prisma.vendor.upsert({
    where: { id: PWR_ID },
    update: {},
    create: {
      id: PWR_ID,
      description: 'PowerUs source for tickets',
    },
  });
  const tasks = await Promise.all(
    PWR_URLS.map(async url => {
      const pwrTask = await prisma.powerusTask.findUnique({
        where: { url },
      });
      if (pwrTask !== null) {
        return pwrTask;
      }
      const newPwrTask = await prisma.powerusTask.create({
        data: {
          url,
          cacheTTL: 1000 * 60 * 60, // 1 hour = 60*60*1000
          schedulerTask: {
            create: {
              vendorId: PWR_ID,
              refteshAfterMs: 3300000, // 55 min = 3600000 - 5*60*1000
              retryAttempts: 2,
            },
          },
        },
      });
      return newPwrTask;
    }),
  );
  console.log('Tasks seeded:', vnd, tasks);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
