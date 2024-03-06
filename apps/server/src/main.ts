import chalk from 'chalk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
async function main() {
  console.log(
    chalk.dim(`Creating server http://localhost:${chalk.green(String(PORT))}`),
  );
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    snapshot: true,
  });
  await app.listen(PORT);
}

void main();
