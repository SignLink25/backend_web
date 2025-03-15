import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  await app.listen(envs.port);

  logger.log(`>> Application run in http://localhost:${envs.port}`);
}
bootstrap();
