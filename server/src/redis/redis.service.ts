import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService {
  private readonly redisClient: Redis

  constructor() {
    this.redisClient = new Redis()
  }

  private async getKeysByPattern(pattern: string): Promise<string[]> {
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

  //#region Typing
  async startTyping(userId: string, targetId: string) {
    await this.redisClient.set(`typing:${targetId}:${userId}`, '', 'EX', 10)
  }

  async stopTyping(userId: string, targetId: string) {
    await this.redisClient.del(`typing:${targetId}:${userId}`)
  }
  //#endregion

  //#region Unread
  async incrementUnread(userId: string, targetId: string) {
    const unreadCount = await this.redisClient.get(
      `unread:${userId}:${targetId}`
    )
    return this.redisClient.set(
      `unread:${userId}:${targetId}`,
      Number(unreadCount) + 1
    )
  }

  async markAsRead(userId: string, targetId: string) {
    return this.redisClient.del(`unread:${userId}:${targetId}`)
  }

  async getAllUnreadData(
    userId: string
  ): Promise<{ [key: string]: string | null }> {
    const pattern = `unread:${userId}:*`
    const keys = await this.getKeysByPattern(pattern)

    if (keys.length === 0) {
      return {}
    }

    const unreadData: { [key: string]: string | null } = {}
    const values = await Promise.all(keys.map(key => this.redisClient.get(key)))

    keys.forEach((key, index) => {
      const [, targetId] = key.split(':')
      unreadData[targetId] = values[index]
    })

    return unreadData
  }
  //#endregion

  //#region Read
  async markMessageAsRead(userId: string, targetId: string, messageId: string) {
    const key = `read:${targetId}:${userId}`
    return this.redisClient.set(key, messageId)
  }

  async getReadMessagesForTarget(
    targetId: string
  ): Promise<{ [userId: string]: string }> {
    const key = `read:${targetId}:*`
    const keys = await this.getKeysByPattern(key)

    const readMessages: { [userId: string]: string } = {}
    for (const k of keys) {
      const [, , readUserId] = k.split(':')
      const messageId = await this.redisClient.get(k)
      readMessages[readUserId] = messageId
    }

    return readMessages
  }
  //#endregion

  //#region Presence
  async getUsersPresence(
    usersId: string[]
  ): Promise<{ [userId: string]: string }> {
    const usersPresence: { [userId: string]: string } = {}
    for (const userId of usersId) {
      const status = await this.redisClient.get(`presence:${userId}`)
      usersPresence[userId] = status
    }

    return usersPresence
  }
  //#endregion
}
