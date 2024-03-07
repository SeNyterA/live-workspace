import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as crypto from 'crypto-js'
import { EFileSourceType, File } from 'src/entities/file.entity'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { MailService } from '../mail/mail.service'
import { TLoginPayload } from './auth.dto'

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly mailService: MailService
  ) {}

  private _comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): boolean {
    const hash = crypto.SHA256(plainPassword).toString()
    return hash === hashedPassword
  }

  private async validateUser(
    userNameOrEmail: string,
    password: string
  ): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: [{ userName: userNameOrEmail }, { email: userNameOrEmail }]
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

  private async _generateUserCredentials(user: User): Promise<string> {
    console.log(user)
    const payload = {
      email: user.email,
      userName: user.userName,
      sub: user._id
    }
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET })
  }

  async signIn({ password, userNameOrEmail }: TLoginPayload) {
    const user = await this.validateUser(userNameOrEmail, password)
    if (!user) {
      throw new BadRequestException(`Email or password are invalid`)
    }
    if (!user.isAvailable) {
      const tokenVerify = this.jwtService.sign(
        { sub: user._id },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '1h'
        }
      )
      const verificationLink = `${process.env.CLIENT_VERIFY_MAIL}${tokenVerify}`
      this.mailService.sendEmail({
        to: user.email,
        subject: 'Verify Your Account',
        text: `Hello ${user.userName},\n\nThank you for signing up at Your Website. Please verify your account by clicking on the following link:\n\n${verificationLink}\n\nThis link will expire in 1 hour.\n\nIf you did not sign up for an account, please ignore this email.\n\nBest regards,\nThe Your Website Team`
      })
      return { error: { message: '', code: 100111 } }
    }
    const access_token = await this._generateUserCredentials(user)
    return {
      user: user,
      token: access_token
    }
  }

  async signInWithSocial({ token }: { token: string }) {
    try {
      const payload: FirebaseUserTokenData = this.jwtService.decode(token)
      const user = await this.userRepository.findOne({
        where: { firebaseId: payload.user_id, isAvailable: true }
      })

      if (user) {
        const access_token = await this._generateUserCredentials(user)
        return {
          user: user,
          token: access_token
        }
      } else {
        const avatarFile = this.fileRepository.create({
          path: payload.picture,
          sourceType: EFileSourceType.Link
        })
        await this.fileRepository.save(avatarFile)

        await this.userRepository.insert({
          userName: payload.email.split('@')[0],
          email: payload.email,
          firebaseId: payload.user_id,
          nickName: payload.name,
          avatar: avatarFile
        })

        const user = await this.userRepository.findOne({
          where: { firebaseId: payload.user_id, isAvailable: true }
        })

        const access_token = await this._generateUserCredentials(user)
        return {
          user: user,
          token: access_token
        }
      }
    } catch {
      throw new UnauthorizedException()
    }
  }

  async signUp(userDto: any) {
    // const existingUser = await this.userRepository.findOne({
    //   where: [{ email: userDto.email }, { userName: userDto.userName }]
    // })
    // if (existingUser) {
    //   if (existingUser.isAvailable) {
    //     return false
    //   } else {
    //     const tokenVerify = this.jwtService.sign(
    //       { sub: existingUser._id },
    //       {
    //         secret: process.env.JWT_SECRET,
    //         expiresIn: '1h'
    //       }
    //     )
    //     const verificationLink = `${process.env.CLIENT_VERIFY_MAIL}${tokenVerify}`
    //     this.mailService.sendEmail({
    //       to: userDto.email,
    //       subject: 'Verify Your Account',
    //       text: `Hello ${existingUser.userName},\n\nThank you for signing up at Your Website. Please verify your account by clicking on the following link:\n\n${verificationLink}\n\nThis link will expire in 1 hour.\n\nIf you did not sign up for an account, please ignore this email.\n\nBest regards,\nThe Your Website Team`
    //     })
    //     return true
    //   }
    // } else {
    //   const _password = userDto.password
    //   const hashedPassword = crypto.SHA256(_password).toString()
    //   userDto.password = hashedPassword
    //   const user = await this.userRepository.create({
    //     ...userDto,
    //     isAvailable: false
    //   })
    //   await this.userRepository.save(user)
    //   const tokenVerify = this.jwtService.sign(
    //     { sub: user._id },
    //     {
    //       expiresIn: '1h'
    //     }
    //   )
    //   const verificationLink = `${process.env.CLIENT_VERIFY_MAIL}${tokenVerify}`
    //   this.mailService.sendEmail({
    //     to: userDto.email,
    //     subject: 'Verify Your Account',
    //     text: `Hello ${user.userName},\n\nThank you for signing up at Your Website. Please verify your account by clicking on the following link:\n\n${verificationLink}\n\nThis link will expire in 1 hour.\n\nIf you did not sign up for an account, please ignore this email.\n\nBest regards,\nThe Your Website Team`
    //   })
    //   return true
    // }
  }

  async verifyAccount(token: string) {
    try {
      const payload: { sub: string } = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET
        }
      )
      const user = await this.userRepository.findOne({
        where: { _id: payload.sub, isAvailable: false }
      })
      if (!user) {
        return { message: 'Invalid token or account already verified' }
      }
      this.userRepository.update(user._id, { isAvailable: true })
      const access_token = await this._generateUserCredentials(user)
      return {
        user: user,
        token: access_token
      }
    } catch (error) {
      console.error('Error verifying account:', error.message)
      return { message: 'Failed to verify account' }
    }
  }

  async getProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: { _id: id },
      relations: ['avatar']
    })
    return user
  }
}
