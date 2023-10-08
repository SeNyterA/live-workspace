import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export enum EChannelType {
  Private = 'private',
  Public = 'public',
  System = 'system'
}

export enum EChannelMemberType {
  Owner = 0,
  Admin = 1,
  Member = 2
}

@Schema()
export class ChannelMember {
  _id: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string

  @Prop({ enum: EChannelMemberType, default: EChannelMemberType.Member })
  type: EChannelMemberType
}

@Schema()
export class Channel {
  @Prop({ type: String, enum: EChannelType })
  channelType: EChannelType

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  teamId: string

  @Prop({ type: [SchemaFactory.createForClass(ChannelMember)], default: [] })
  members: ChannelMember[]

  //#region common
  _id: string

  @Prop()
  title: string

  @Prop()
  description?: string

  @Prop()
  avatar?: string

  @Prop()
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
  //#endregion
}

export const ChannelSchema = SchemaFactory.createForClass(Channel)
