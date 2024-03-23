import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService {
  readonly redisClient: Redis
  // readonly subRedis: Redis

  constructor() {
    this.redisClient = new Redis(process.env.REDIS_URL, {
      password: process.env.REDIS_PASSWORD
    })
    // this.subRedis = this.redisClient.duplicate()
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

  // await this.redisService.redisClient.set(
  //   `presence:${jwtUser.sub}`,
  //   'online'
  // )
  async getUsersPresence(userIds: string[]) {
    const usersPresence: { [userId: string]: any } = {}
    for (const userId of userIds) {
      const presence = await this.redisClient.get(`presence:${userId}`)
      usersPresence[userId] = presence
    }

    return usersPresence
  }
}
