// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // This will enable CORS for all origins, be more specific in a production environment!
  await app.listen(3001);
}
bootstrap();
