import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { User } from '@prisma/client'
import { UserId } from 'src/decorators/users.decorator'
import { TJwtUser } from '../socket/socket.gateway'
import { Public } from './auth.guard'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: any) {
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
  getProfile(@UserId() userId: string) {
    return this.authService.getProfile(userId)
  }

  @Public()
  @Post('verify')
  verifyAccount(@Body() payload: { token: string }) {
    return this.authService.verifyAccount(payload.token)
  }

  @Patch('profile')
  updateProfile(@UserId() userId: string, @Body() updateProfileDto: User) {
    return this.authService.updateProfile({
      userId: userId,
      user: updateProfileDto
    })
  }
}
