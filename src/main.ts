import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';

async function server(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  const logger: Logger = new Logger('AppService');
  const PORT: number = 5000;
  await app.listen(PORT).then((): void => logger.log(`Server is running on port ${PORT}`));
}

server();
