import chalk from 'chalk';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { version } from '../package.json';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV;
console.log(chalk.dim(`NODE_ENV: ${chalk.yellow(String(NODE_ENV))}`));

async function main() {
  console.log(
    chalk.dim(`Creating server http://localhost:${chalk.green(String(PORT))}`),
  );
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Airplanes tickets example')
    .setDescription('The Airplanes tickets API description')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT);
}

void main();
