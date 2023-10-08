import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export enum ChannelType {
  Private = 'private',
  Public = 'public',
  System = 'system'
}

@Schema()
export class Channel {
  @Prop({ type: String, enum: ChannelType })
  channelType: string

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  teamId: string

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
