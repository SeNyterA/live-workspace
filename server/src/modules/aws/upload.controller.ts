import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { FileSourceType } from '@prisma/client'
import { MulterFile } from 'multer'
import slugify from 'slugify'
import { UserId } from 'src/decorators/users.decorator'
import { PrismaService } from '../prisma/prisma.service'
import { TJwtUser } from '../socket/socket.gateway'
import { AWSConfigService } from './aws.config'

@Controller('')
export class UploadController {
  constructor(
    private readonly awsConfigService: AWSConfigService,
    private readonly prismaService: PrismaService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() fileRaw: MulterFile,
    @UserId() userId: string
  ) {
    const { originalname, buffer, mimetype } = fileRaw
    const timestamp = new Date().getTime()
    const fileName = `${timestamp}_${userId}_${slugify(originalname, {
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

    return this.prismaService.file.create({
      data: {
        size: fileRaw.size,
        createdBy: { connect: { id: userId } },
        modifiedBy: { connect: { id: userId } },
        path: uploadResult.Location,
        name: originalname,
        sourceType: FileSourceType.AWS
      }
    })
  }
}
