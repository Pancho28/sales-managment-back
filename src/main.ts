import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);

  await app.listen(port, '0.0.0.0', () => {
    logger.log(`Server is running in port ${port}.`);
  });
}
bootstrap();
