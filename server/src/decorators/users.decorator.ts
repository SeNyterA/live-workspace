import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { CustomSocket } from 'src/modules/workspace/workspace.gateway'

export const WsUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToWs().getClient()
    return request.user
  }
)

export const HttpUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user as CustomSocket['user']
  }
)

export const WsClient = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToWs().getClient()
  }
)
