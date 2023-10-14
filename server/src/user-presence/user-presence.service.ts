import { Redis } from 'ioredis'

export class UserPresenceService {
  private readonly redisClient: Redis

  constructor() {
    this.redisClient = new Redis()
  }

  async setValue(key: string, value: string): Promise<void> {
    const users = Array(1000000)
      .fill(1)
      .map((e, index) =>
        this.redisClient.set(`user_presence:${index}`, Date.now().toString())
      )
  }

  async getValue(key: string): Promise<string | null> {
    return await this.redisClient.get(key)
  }

  // async getUsersInRange(
  //   startIndex: number,
  //   endIndex: number
  // ): Promise<string[]> {
  //   const userPromises: Promise<string | null>[] = []
  //   for (let index = startIndex; index <= endIndex; index++) {
  //     userPromises.push(this.redisClient.get(`user:${index}`))
  //   }

  //   const userValues = await Promise.all(userPromises)
  //   return userValues.filter(value => value !== null)
  // }

  async getUsersInRange(
    startIndex: number,
    endIndex: number
  ): Promise<{ [key: string]: string }> {
    const userValues: { [key: string]: string } = {}

    const userPromises: Promise<string | null>[] = []
    for (let index = startIndex; index <= endIndex; index++) {
      userPromises.push(this.redisClient.get(`user:${index}`))
    }

    const values = await Promise.all(userPromises)
    values.forEach((value, index) => {
      if (value !== null) {
        userValues[`user:${startIndex + index}`] = value
      }
    })

    return userValues
  }

  async setUnread(): Promise<void> {
    const users = Array(1000)
      .fill(1)
      .map((e, index) => {
        const timeStamp = Date.now().toString()

        Array(1000)
          .fill(1)
          .map((__ee, __index) =>
            this.redisClient.set(`unread:${index}_${__index}`, timeStamp)
          )
      })
  }

  async getUnreadKeysForUserIndex(userIndex: string): Promise<string[]> {
    const pattern = `unread:${userIndex}_*`

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

  async getUnreadDataForUserIndex(
    userIndex: string
  ): Promise<{ [key: string]: string | null }> {
    const keys = await this.getUnreadKeysForUserIndex(userIndex)

    if (keys.length === 0) {
      return {}
    }

    return new Promise<{ [key: string]: string | null }>((resolve, reject) => {
      this.redisClient.mget(keys, (err, values) => {
        if (err) {
          reject(err)
        } else {
          const keyValueMap: { [key: string]: string | null } = {}
          keys.forEach((key, index) => {
            keyValueMap[key] = values[index]
          })
          resolve(keyValueMap)
        }
      })
    })
  }

  async clearAllKeys(): Promise<void> {
    const keys = await this.getAllKeys()

    if (keys.length > 0) {
      await this.redisClient.del(...keys)
      console.log('Deleted keys:', keys)
    } else {
      console.log('No keys to delete.')
    }
  }

  private async getAllKeys(): Promise<string[]> {
    const pattern = '*' // Match all keys
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
