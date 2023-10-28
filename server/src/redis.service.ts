import { Global, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

@Global()
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

      const [type, targetId, userId] = key.split(':')
      console.log({
        type,
        targetId,
        userId
      })
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
