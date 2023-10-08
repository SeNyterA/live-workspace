import { Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { variblesConfig } from 'src/libs/config'

@Injectable()
export class AWSConfigService {
  private readonly s3: S3
  private readonly bucketName: string

  constructor() {
    this.bucketName = variblesConfig.BUCKET_NAME

    const awsConfig = {
      accessKeyId: variblesConfig.AWS_ACCESS_KEY_ID,
      secretAccessKey: variblesConfig.AWS_SECRET_ACCESS_KEY,
      region: variblesConfig.AWS_REGION
    }
    this.s3 = new S3(awsConfig)
  }

  getS3Instance(): S3 {
    return this.s3
  }

  getBucketName(): string {
    return this.bucketName
  }
}
