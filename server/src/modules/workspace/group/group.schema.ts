import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { WorkspaceSchema } from '../workspace.schema'

@Schema()
export class Group extends WorkspaceSchema {}

export const GroupSchema = SchemaFactory.createForClass(Group)
