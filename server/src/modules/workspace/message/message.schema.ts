import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Workspace } from '../workspace.schema'

export enum EMessageFor {
  Channel = 'Channel',
  Group = 'Group',
  Direct = 'Direct',
  Card = 'Card'
}

export enum EMessageType {
  Normal = 'Normal',
  System = 'System'
}

@Schema()
export class Message extends Workspace {
  @Prop({ type: Object, default: {} })
  content: {
    [key: string]: string | string[] | undefined
  }

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

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  replyRootId?: string

  @Prop({ type: Object, default: {} })
  reactions: {
    [userId: string]: string
  }
}
