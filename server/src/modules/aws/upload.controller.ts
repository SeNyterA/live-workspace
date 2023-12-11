import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { MulterFile } from 'multer'
import slugify from 'slugify'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from '../workspace/workspace.gateway'
import { AWSConfigService } from './aws.config'

@Controller('')
export class UploadController {
  constructor(private readonly awsConfigService: AWSConfigService) {}

  @Post('upload')
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

    return {
      url: uploadResult.Location
    }
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: MulterFile[],
    @HttpUser() user: TJwtUser
  ) {
    const s3 = this.awsConfigService.getS3Instance()

    const uploadResults = await Promise.all(
      files.map(async file => {
        const { originalname, buffer, mimetype } = file
        const timestamp = new Date().getTime()
        const fileName = `${timestamp}_${user.sub}_${slugify(originalname, {
          lower: true,
          remove: /[*+~()'"!:@]/g
        }).replace(/-/g, '_')}`

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

        return {
          url: uploadResult.Location
        }
      })
    )

    return { urls: uploadResults.map(result => result.url) }
  }
}
