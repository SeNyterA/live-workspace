import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { EventEmitter } from 'events'
import { AppModule } from './app.module'
import { RedisIoAdapter } from './modules/adapters/redis-io.adapter'
;(EventEmitter.prototype as any)._maxListeners = 15

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true })

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true
    })
  )

  const redisIoAdapter = new RedisIoAdapter(app)
  await redisIoAdapter.connectToRedis()
  app.useWebSocketAdapter(redisIoAdapter)

  await app.listen(Number(process.env.PORT) || 8420)
}
bootstrap()
