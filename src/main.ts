import { NestFactory } from '@nestjs/core';
import { AppModule } from './resources/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(3030);
}

bootstrap();
