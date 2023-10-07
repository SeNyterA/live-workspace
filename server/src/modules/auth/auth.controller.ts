import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { getUserId } from 'src/libs/getUserId';
import { TCreateUser } from 'src/modules/users/user.dto';
import { TLoginPayload } from './auth.dto';
import { AuthGuard, Public } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: TLoginPayload) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('register')
  signUp(@Body() signUpDto: TCreateUser) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(getUserId(req));
  }
}
