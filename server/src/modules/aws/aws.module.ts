import { Module } from '@nestjs/common'
import { AWSConfigService } from './aws.config'
import { UploadController } from './upload.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { File } from 'src/entities/file.entity'

@Module({
  providers: [AWSConfigService],
  exports: [AWSConfigService],
  controllers: [UploadController],
  imports: [TypeOrmModule.forFeature([User, File])]
})
export class AWSModule {}
