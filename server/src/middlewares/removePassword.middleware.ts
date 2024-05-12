import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class RemovePasswordMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json
    res.json = function (json: any) {
      const updatedJson = this.removePassword(json)
      res.setHeader('Content-Type', 'application/json')
      originalJson.call(res, updatedJson)
    }.bind(this)

    next()
  }

  removePassword(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.removePassword(item))
    } else if (typeof data === 'object' && data !== null) {
      for (let key in data) {
        if (key === 'password') {
          delete data[key]
        } else {
          data[key] = this.removePassword(data[key])
        }
      }
    }
    return data
  }
}
