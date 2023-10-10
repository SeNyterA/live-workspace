import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { MemberSchema, WorkspaceSchema } from '../workspace.schema'

@Schema()
export class Team extends WorkspaceSchema {
  @Prop({ type: [SchemaFactory.createForClass(MemberSchema)], default: [] })
  members: MemberSchema[]
}

export const TeamSchema = SchemaFactory.createForClass(Team)
