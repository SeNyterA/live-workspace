import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ManagedUpload } from 'aws-sdk/clients/s3'
import { MulterFile } from 'multer'
import slugify from 'slugify'
import { AWSConfigService } from './aws.config'

@Controller('upload')
export class UploadController {
  constructor(private readonly awsConfigService: AWSConfigService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Request() request: any
  ): Promise<ManagedUpload.SendData> {
    const { originalname, buffer, mimetype } = file
    const timestamp = new Date().getTime()
    const fileName = `${timestamp}_${request?.user?.userId || ''}_${slugify(
      originalname,
      { lower: true, remove: /[*+~()'"!:@]/g }
    ).replace(/-/g, '_')}`

    const s3 = this.awsConfigService.getS3Instance()
    const uploadResult = await s3
      .upload({
        Bucket: this.awsConfigService.getBucketName(),
        Key: fileName,
        Body: buffer,
        ContentType: mimetype
      })
      .promise()

    return uploadResult
  }
}
