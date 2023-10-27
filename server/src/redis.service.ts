import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService {
  readonly redisClient: Redis
  private readonly subRedis: Redis

  constructor() {
    this.redisClient = new Redis()
    this.subRedis = this.redisClient.duplicate()
    this.listenToExpiredKeys()
  }

  private async listenToExpiredKeys() {
    await this.subRedis.psubscribe(`*:expired`)
    await this.subRedis.on('pmessage', async (pattern, channel, key) => {
      console.log({ pattern, channel, key })
    })
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
