import { Body, Controller, Get, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TCreateUser } from 'src/modules/users/user.dto'

import { TJwtUser } from '../workspace/workspace.gateway'
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
  @Post('register')
  signUp(@Body() signUpDto: TCreateUser) {
    return this.authService.signUp(signUpDto)
  }

  @Get('profile')
  getProfile(@HttpUser() user: TJwtUser) {
    return this.authService.getProfile(user.sub)
  }
}
