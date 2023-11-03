import { Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'

@Injectable()
export class AWSConfigService {
  private readonly s3: S3
  private readonly bucketName: string

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME

    const awsConfig = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
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
