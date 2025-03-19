import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix(envs.prefix);

  const logger = new Logger('Bootstrap');

  await app.listen(envs.port);

  logger.log(`>> Application run in ${envs.server_url}${envs.prefix}`);
}
bootstrap();
