import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TCreateUser, TUser } from 'src/users/user.dto';
import { UsersService } from '../users/users.service';
import { TLoginPayload, TLoginResponse } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async _validateUser(email: string, password: string) {
    const user = await await this.usersService._findByUserNameOrEmail(email);
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async _generateUserCredentials(user: TUser) {
    const payload = {
      email: user.email,
      userName: user.userName,
      sub: user._id,
    };
    return this.jwtService.sign(payload);
  }

  async signIn({
    password,
    userNameOrEmail,
  }: TLoginPayload): Promise<TLoginResponse> {
    const user = await this._validateUser(userNameOrEmail, password);
    if (!user) {
      throw new BadRequestException(`Email or password are invalid`);
    } else {
      const access_token = await this._generateUserCredentials(user);
      return {
        user: user,
        token: access_token,
      };
    }
  }

  async signUp(userDto: TCreateUser) {
    return this.usersService.createUser(userDto);
  }

  async getProfile(id: string) {
    return await this.usersService.findById(id);
  }
}
