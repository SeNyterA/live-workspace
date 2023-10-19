import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export enum EStatusType {
  Private = 'private',
  Public = 'public',
  System = 'system'
}

@Schema()
export class WorkspaceSchema {
  _id: string

  @Prop({ default: '' })
  title: string

  @Prop({ default: '' })
  description?: string

  @Prop({ default: '' })
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
