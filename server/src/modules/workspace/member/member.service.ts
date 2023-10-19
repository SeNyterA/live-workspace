import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { EMemberRole, Member } from './member.schema'

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>
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
}
