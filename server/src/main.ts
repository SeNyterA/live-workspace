import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { RedisIoAdapter } from './modules/adapters/redis-io.adapter'

async function bootstrap() {
  const envVariables = {
    PORT: process.env.PORT,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    MAIL_SERVICE: process.env.MAIL_SERVICE,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    CLIENT_VERIFY_MAIL: process.env.CLIENT_VERIFY_MAIL,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DB: process.env.MYSQL_DB
  }

  console.log(envVariables)
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
