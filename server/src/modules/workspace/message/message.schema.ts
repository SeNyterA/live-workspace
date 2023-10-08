import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export enum EMessageType {
  Channel = 0,
  Group = 1,
  Direct = 2,
  Systeam = 3
}

@Schema()
export class Message {
  @Prop({ required: true })
  content: string

  @Prop({ type: Types.ObjectId })
  messageReferenceId: string

  @Prop({ type: [{ type: String }] })
  attachments?: string[]

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  replyToMessageId?: string

  // Common
  _id: string

  @Prop()
  ancestorPath: string

  @Prop()
  createdById: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  modifiedById?: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date

  @Prop({ default: true })
  isAvailable: boolean
}

export const MessageSchema = SchemaFactory.createForClass(Message)
