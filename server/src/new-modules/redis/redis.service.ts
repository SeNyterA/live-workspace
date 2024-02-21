import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService {
  readonly redisClient: Redis
  readonly subRedis: Redis

  constructor() {
    this.redisClient = new Redis(process.env.REDIS_URL, {
      password: process.env.REDIS_PASSWORD
    })
    this.subRedis = this.redisClient.duplicate()
  }

  async getKeysByPattern(pattern: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.redisClient.keys(pattern, (err, keys) => {
        if (err) {
          reject(err)
        } else {
          resolve(keys)
        }
      })
    })
  }
}
