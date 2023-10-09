import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { EStatusType, MemberBase, WorkspaceBase } from '../../common.schema'

@Schema()
export class Channel extends WorkspaceBase {
  @Prop({ type: Types.ObjectId, ref: 'Team' })
  teamId: string

  @Prop({ type: String, enum: EStatusType })
  channelType: EStatusType

  @Prop({ type: [SchemaFactory.createForClass(MemberBase)], default: [] })
  members: MemberBase[]

  @Prop()
  path: string
}

export const ChannelSchema = SchemaFactory.createForClass(Channel)
