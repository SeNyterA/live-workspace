import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import * as crypto from 'crypto-js'
import { Model } from 'mongoose'
import { removePassword } from 'src/libs/removePassword'
import { TCreateUser, TUser } from 'src/modules/users/user.dto'
import { User } from '../users/user.schema'
import { TLoginPayload, TLoginResponse } from './auth.dto'

export type FirebaseUserTokenData = {
  name: string
  picture: string
  iss: string
  aud: string
  auth_time: number
  user_id: string
  sub: string
  iat: number
  exp: number
  email: string
  email_verified: boolean
  firebase: {
    identities: {
      'google.com': string[]
      email: string[]
    }
    sign_in_provider: string
  }
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) public userModel: Model<User>
  ) {}

  private _comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): boolean {
    const hash = crypto.SHA256(plainPassword).toString()
    return hash === hashedPassword
  }
  private async validateUser(userNameOrEmail: string, password: string) {
    try {
      const user = await this.userModel.findOne({
        $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }]
      })

      if (!user) {
        return null
      }

      const isPasswordCorrect = this._comparePasswords(password, user.password)

      if (!isPasswordCorrect) {
        return null
      }

      return user
    } catch (error) {
      console.error('Error validating user:', error)
      throw error
    }
  }

  private async _generateUserCredentials(user: TUser) {
    const payload = {
      email: user.email,
      userName: user.userName,
      sub: user._id
    }
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET })
  }

  async signIn({
    password,
    userNameOrEmail
  }: TLoginPayload): Promise<TLoginResponse> {
    const user = await this.validateUser(userNameOrEmail, password)
    if (!user) {
      throw new BadRequestException(`Email or password are invalid`)
    }
    const access_token = await this._generateUserCredentials(user)
    return {
      user: removePassword(user.toJSON()),
      token: access_token
    }
  }

  async signInWithSocial({ token }: { token: string }) {
    try {
      const payload: FirebaseUserTokenData = this.jwtService.decode(token)
      const user = await this.userModel.findOne({ firebaseId: payload.user_id })

      if (!user) {
        const newUser = await this.userModel.create({
          userName: payload.email.split('@')[0],
          email: payload.email,
          firebaseId: payload.user_id,
          avatar: payload.picture,
          nickname: payload.name
        })

        const access_token = await this._generateUserCredentials(newUser)

        return {
          user: removePassword(newUser.toJSON()),
          token: access_token
        }
      } else {
        const access_token = await this._generateUserCredentials(user)

        return {
          user: removePassword(user.toJSON()),
          token: access_token
        }
      }
    } catch {
      throw new UnauthorizedException()
    }
  }

  async signUp(userDto: TCreateUser) {
    const _password = userDto.password
    const hashedPassword = crypto.SHA256(_password).toString()
    userDto.password = hashedPassword
    await this.userModel.create({ ...userDto, isAvailable: false })
    // const access_token = await this._generateUserCredentials(user)
    // return {
    //   user: removePassword(user.toJSON()),
    //   token: access_token
    // }

    return true
  }

  async getProfile(id: string) {
    const user = await this.userModel.findById(id)
    return removePassword(user.toJSON())
  }
}
