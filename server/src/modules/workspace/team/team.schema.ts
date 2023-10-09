import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { MemberBase, WorkspaceBase } from '../common.schema'

@Schema()
export class Team extends WorkspaceBase {
  @Prop({ type: [SchemaFactory.createForClass(MemberBase)], default: [] })
  members: MemberBase[]
}

export const TeamSchema = SchemaFactory.createForClass(Team)
