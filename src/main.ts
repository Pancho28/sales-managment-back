import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  const port = process.env.PORT || 3001;

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  app.enableCors({
    /*origin: [ activar luego
    `${process.env.FRONTEND_HOST}`
    ] */
  })

  await app.listen(port, '0.0.0.0', () => {
    logger.log(`Server is running in port ${port}.`);
  });
}
bootstrap();
