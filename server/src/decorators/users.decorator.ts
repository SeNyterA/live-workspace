import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const WsUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToWs().getClient()
    return request._id
  }
)

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.userId
  }
)

// export const WsClient = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     return ctx.switchToWs().getClient()
//   }
// )
