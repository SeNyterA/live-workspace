import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { FileSourceType, User } from '@prisma/client'
import * as crypto from 'crypto-js'
import { Errors } from 'src/libs/errors'
import { MailService } from '../mail/mail.service'
import { PrismaService } from '../prisma/prisma.service'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

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

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class AuthService {
  @WebSocketServer()
  server: Server
  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService
  ) {}

  private async _generateUserCredentials(user: User): Promise<string> {
    console.log(user)
    const payload = {
      email: user.email,
      userName: user.userName,
      sub: user.id
    }
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET })
  }
  private _comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): boolean {
    const hash = crypto.SHA256(plainPassword).toString()
    return hash === hashedPassword
  }

  async signIn({
    password,
    userNameOrEmail
  }: {
    password?: string
    userNameOrEmail?: string
  }) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: userNameOrEmail }, { userName: userNameOrEmail }]
      }
    })

    if (!user) throw new BadRequestException(`Email or password are invalid`)
    if (!this._comparePasswords(password, user.password))
      throw new BadRequestException(`Email or password are invalid`)

    if (!user.isAvailable) {
      const tokenVerify = this.jwtService.sign(
        { sub: user.id },
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
      return new UnauthorizedException({
        code: Errors.PLEASE_VERIFY_YOUR_ACCOUNT
      })
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
      const existingUser = await this.prismaService.user.findUnique({
        where: { firebaseId: payload.user_id },
        include: { avatar: true }
      })

      if (existingUser) {
        const access_token = await this._generateUserCredentials(existingUser)
        return {
          user: existingUser,
          token: access_token
        }
      } else {
        const user = await this.prismaService.user.create({
          data: {
            userName: payload.email.split('@')[0],
            email: payload.email,
            firebaseId: payload.user_id,
            nickName: payload.name,
            avatar: {
              create: {
                path: payload.picture,
                sourceType: FileSourceType.Link
              }
            }
          },
          include: { avatar: true }
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

  async signUp(userDto: User) {
    // const existingUser = await this.userRepository.findOne({
    //   where: [{ email: userDto.email }, { userName: userDto.userName }]
    // })
    // if (existingUser) {
    //   if (existingUser.isAvailable) {
    //     return false
    //   } else {
    //     const tokenVerify = this.jwtService.sign(
    //       { sub: existingUser.id },
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
    //     { sub: user.id },
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
      const user = await this.prismaService.user.update({
        where: { id: payload.sub, isAvailable: false },
        data: { isAvailable: true },
        include: { avatar: true }
      })

      if (!user) {
        return { message: 'Failed to verify account' }
      }
      const access_token = await this._generateUserCredentials(user)
      return {
        user: user,
        token: access_token
      }
    } catch (error) {
      return { message: 'Failed to verify account' }
    }
  }

  async getProfile(id: string) {
    return this.prismaService.user.findUnique({
      where: { id: id },
      include: { avatar: true }
    })
  }

  async _emitProfileUpdated(user: User) {
    const members = await this.prismaService.member.findMany({
      where: {
        userId: user.id
      }
    })

    this.server.to(members.map(e => e.workspaceId)).emit('user', { user })
  }
  async updateProfile({ id, user }: { id: string; user: User }) {
    const profileUpdated = await this.prismaService.user.update({
      where: { id: id, isAvailable: true },
      data: user,
      include: { avatar: true }
    })

    if (!profileUpdated) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }

    this._emitProfileUpdated(profileUpdated)
    return profileUpdated
  }
}
