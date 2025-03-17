import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Genera error si hay propiedades no permitidas
      transform: true, // Convierte los datos a instancias de la clase DTO
    }),
  );

  const logger = new Logger('Bootstrap');

  await app.listen(envs.port);

  logger.log(`>> Application run in http://localhost:${envs.port}`);
}
bootstrap();
