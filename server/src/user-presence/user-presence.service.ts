import { Redis } from 'ioredis'

export class UserPresenceService {
  private readonly redisClient: Redis

  constructor() {
    this.redisClient = new Redis()
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value)
  }

  async getValue(key: string): Promise<string | null> {
    return await this.redisClient.get(key)
  }
}
