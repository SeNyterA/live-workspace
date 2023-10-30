import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from 'src/modules/users/user.schema'
import { EMemberRole, EMemberType, Member } from './member.schema'

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async _checkExisting({
    targetId,
    userId,
    inRoles = [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
    isAvailable = true
  }: {
    userId: string
    targetId: string
    inRoles?: EMemberRole[]
    isAvailable?: boolean
  }) {
    const existingMember = await this.memberModel.findOne({
      isAvailable,
      userId,
      targetId,
      role: {
        $in: inRoles
      }
    })

    if (!existingMember) {
      throw new ForbiddenException('Your dont have permission')
    }

    return !!existingMember
  }

  async _getByTargetId({ targetId }: { targetId: string }) {
    const members = await this.memberModel.find({
      isAvailable: true,
      targetId
    })

    return members
  }

  async _getByUserId({ userId }: { userId: string }) {
    const members = await this.memberModel.find({
      isAvailable: true,
      userId
    })

    return members
  }

  async getMembersByTargetId({
    userId,
    targetId,
    includeUsers = false
  }: {
    userId: string
    targetId: string
    includeUsers?: boolean
  }) {
    await this._checkExisting({
      targetId,
      userId
    })

    const members = await this.memberModel.find({ targetId }).lean()

    let users
    if (includeUsers) {
      users = await this.userModel
        .find({ _id: { $in: members.map(e => e.userId.toString()) } })
        .lean()
    }

    return {
      members,
      users
    }
  }
}
