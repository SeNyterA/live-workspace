import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Workspace } from '../../workspace.schema'

@Schema()
export class Board extends Workspace {
  @Prop({ type: Types.ObjectId, ref: 'Team', required: true })
  teamId: string
}
