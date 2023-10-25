import { Schema } from '@nestjs/mongoose'
import { Workspace } from '../workspace.schema'

@Schema()
export class Team extends Workspace {}
