import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterFile } from 'multer'
import slugify from 'slugify'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from '../workspace/workspace.gateway'
import { AWSConfigService } from './aws.config'

@Controller('upload')
export class UploadController {
  constructor(private readonly awsConfigService: AWSConfigService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @HttpUser() user: TJwtUser
  ) {
    const { originalname, buffer, mimetype } = file
    const timestamp = new Date().getTime()
    const fileName = `${timestamp}_${user.sub}_${slugify(originalname, {
      lower: true,
      remove: /[*+~()'"!:@]/g
    }).replace(/-/g, '_')}`

    const s3 = this.awsConfigService.getS3Instance()

    const uploadResult = await s3
      .upload({
        Bucket: this.awsConfigService.getBucketName(),
        Key: fileName,
        Body: buffer,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline'
      })
      .promise()

    return uploadResult
  }
}
