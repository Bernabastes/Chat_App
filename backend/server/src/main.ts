import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-io.adapter';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // For local development without Redis, comment out Redis adapter
  // const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  // const pubClient = new Redis(redisUrl);
  // const subClient = new Redis(redisUrl);
  // app.useWebSocketAdapter(new RedisIoAdapter(app, pubClient, subClient));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
