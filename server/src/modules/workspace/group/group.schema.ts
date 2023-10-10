import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { WorkspaceSchema } from '../workspace.schema'

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
export class Group extends WorkspaceSchema {
  @Prop({ type: [SchemaFactory.createForClass(GroupMember)], default: [] })
  members: GroupMember[]
}

export const GroupSchema = SchemaFactory.createForClass(Group)
