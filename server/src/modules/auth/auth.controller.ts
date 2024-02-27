import { Body, Controller, Get, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'

import { TJwtUser } from '../socket/socket.gateway'
import { TLoginPayload } from './auth.dto'
import { Public } from './auth.guard'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: TLoginPayload) {
    return this.authService.signIn(signInDto)
  }

  @Public()
  @Post('loginWithSocial')
  signInWithSocial(@Body() payload: { token: string }) {
    return this.authService.signInWithSocial(payload)
  }

  @Public()
  @Post('register')
  signUp(@Body() signUpDto: any) {
    return this.authService.signUp(signUpDto)
  }

  @Get('profile')
  getProfile(@HttpUser() user: TJwtUser) {
    return this.authService.getProfile(user.sub)
  }

  @Public()
  @Post('verify')
  verifyAccount(@Body() payload: { token: string }) {
    return this.authService.verifyAccount(payload.token)
  }
}
