import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      skipNullProperties: true,
      skipUndefinedProperties: true,
      stopAtFirstError: true
    })
  )
  await app.listen(8430)
}
bootstrap()
