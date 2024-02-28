import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { InjectRepository } from '@nestjs/typeorm'
import { MulterFile } from 'multer'
import slugify from 'slugify'
import { HttpUser } from 'src/decorators/users.decorator'
import { File } from 'src/entities/file.entity'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { TJwtUser } from '../socket/socket.gateway'
import { AWSConfigService } from './aws.config'

@Controller('')
export class UploadController {
  constructor(
    private readonly awsConfigService: AWSConfigService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(File)
    private readonly fileRepository: Repository<File>
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() fileRaw: MulterFile,
    @HttpUser() user: TJwtUser
  ) {
    const { originalname, buffer, mimetype } = fileRaw
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

    const createdFile = await this.fileRepository.insert({
      size: fileRaw.size,
      createdBy: { _id: user.sub },
      modifiedBy: { _id: user.sub },
      path: uploadResult.Location
    })

    return await this.fileRepository.findOne({
      where: { _id: createdFile.identifiers[0]._id }
    })
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
