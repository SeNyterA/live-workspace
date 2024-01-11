import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export enum EMemberRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member'
}

export enum EMemberType {
  Team = 'Team',
  Channel = 'Channel',
  Board = 'Board',
  Group = 'Group',
  DirectMessage = 'DirectMessage'
}

@Schema()
export class Member {
  _id: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string

  @Prop({ type: Types.ObjectId, required: true })
  targetId: string

  @Prop({ enum: EMemberRole, default: EMemberRole.Member, required: true })
  role: EMemberRole

  @Prop({ enum: EMemberType, required: true })
  type: EMemberType

  @Prop({ required: true })
  path: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdById: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  modifiedById: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date

  @Prop({ default: true })
  isAvailable: boolean

  @Prop()
  acceptedAt?: Date

  @Prop({ default: true })
  isAccepted: boolean
}
