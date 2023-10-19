import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { WorkspaceSchema } from '../workspace.schema'

@Schema()
export class Team extends WorkspaceSchema {}

export const TeamSchema = SchemaFactory.createForClass(Team)
