import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export enum EGroupMemberType {
  Owner = 0,
  Admin = 1,
  Member = 2
}

@Schema()
export class GroupMember {
  _id: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string

  @Prop({ enum: EGroupMemberType, default: EGroupMemberType.Member })
  type: EGroupMemberType
}

@Schema()
export class Group {
  @Prop({ type: [SchemaFactory.createForClass(GroupMember)], default: [] })
  members: GroupMember[]

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

export const GroupSchema = SchemaFactory.createForClass(Group)
