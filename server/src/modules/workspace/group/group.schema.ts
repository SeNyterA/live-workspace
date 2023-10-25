import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Workspace } from '../workspace.schema'

@Schema()
export class Group extends Workspace {}
