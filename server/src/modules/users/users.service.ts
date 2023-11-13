import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { TCreateUser, TUser } from './user.dto'
import { User } from './user.schema'
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async _findByUserNameOrEmail(userNameOrEmail: string): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }]
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user.toJSON()
  }

  async _findById(id: string): Promise<TUser> {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user.toJSON()
  }

  async createUser(createUserDto: TCreateUser): Promise<TUser> {
    const saltOrRounds = 10
    const _password = createUserDto.password
    createUserDto.password = await bcrypt.hash(_password, saltOrRounds)
    const { password, ...user } = (
      await this.userModel.create(createUserDto)
    ).toJSON()
    return user
  }

  async findById(id: string): Promise<TUser> {
    const { password, ...user } = (await this.userModel.findById(id)).toJSON()
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async updateUser(id: string, updateUserDto: TCreateUser): Promise<TUser> {
    const { password, ...updatedUser } = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true }
    )
    if (!updatedUser) {
      throw new NotFoundException('User not found')
    }

    return updatedUser
  }

  async findByKeyword(key: string, page: number = 1, pageSize: number = 10) {
    const regex = new RegExp(key, 'i')

    const users = await this.userModel.find({
      $or: [
        { nickname: { $regex: regex } },
        { userName: { $regex: regex } },
        { email: { $regex: regex } }
      ],
      isAvailable: true
    })

    return {
      users
    }
  }
}
