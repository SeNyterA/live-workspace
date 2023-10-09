import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export enum EMemberType {
  Owner = 0,
  Admin = 1,
  Member = 2
}

export enum EStatusType {
  Private = 'private',
  Public = 'public',
  System = 'system'
}

@Schema()
export class MemberBase {
  _id: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string

  @Prop({ enum: EMemberType, default: EMemberType.Member })
  type: EMemberType
}

@Schema()
export class WorkspaceBase {
  _id: string

  @Prop()
  title: string

  @Prop()
  description?: string

  @Prop()
  avatar?: string

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
}
