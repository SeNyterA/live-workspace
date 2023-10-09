import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { WorkspaceBase } from '../common.schema'

@Schema()
export class DirectMessage extends WorkspaceBase {
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    unique: true,
    sparse: true
  })
  userIds: string[]
}

export const DirectMessageSchema = SchemaFactory.createForClass(DirectMessage)
