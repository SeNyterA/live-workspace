import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AWSConfigService } from './aws.config'
import { UploadController } from './upload.controller'

@Module({
  providers: [AWSConfigService],
  exports: [AWSConfigService],
  controllers: [UploadController],
  imports: [PrismaModule]
})
export class AWSModule {}
