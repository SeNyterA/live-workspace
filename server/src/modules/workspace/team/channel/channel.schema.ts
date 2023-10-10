import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { EStatusType, MemberSchema, WorkspaceSchema } from '../../workspace.schema'

@Schema()
export class Channel extends WorkspaceSchema {
  @Prop({ type: Types.ObjectId, ref: 'Team' })
  teamId: string

  @Prop({ type: String, enum: EStatusType })
  channelType: EStatusType

  @Prop({ type: [SchemaFactory.createForClass(MemberSchema)], default: [] })
  members: MemberSchema[]

  @Prop()
  path: string
}

export const ChannelSchema = SchemaFactory.createForClass(Channel)
