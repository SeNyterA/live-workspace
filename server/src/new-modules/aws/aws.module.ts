import { Module } from '@nestjs/common'
import { AWSConfigService } from './aws.config'
import { UploadController } from './upload.controller'

@Module({
  providers: [AWSConfigService],
  exports: [AWSConfigService],
  controllers: [UploadController]
})
export class AWSModule {}
