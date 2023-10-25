import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Workspace } from '../workspace.schema'

export enum EMessageFor {
  Channel = 'Channel',
  Group = 'Group',
  Direct = 'Direct'
}

export enum EMessageType {
  Normal = 'Normal',
  System = 'System'
}

@Schema()
export class Message extends Workspace {
  @Prop({ default: '' })
  content: string

  @Prop({ type: Types.ObjectId, required: true })
  messageReferenceId: string

  @Prop({ enum: EMessageFor, default: EMessageFor.Channel, required: true })
  messageFor: EMessageFor

  @Prop({ enum: EMessageType, default: EMessageType.Normal, required: true })
  messageType: EMessageType

  @Prop({ type: [{ type: String }] })
  attachments?: string[]

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  replyToMessageId?: string
}
