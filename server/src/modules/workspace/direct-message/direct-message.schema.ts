import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Workspace } from '../workspace.schema'

@Schema()
export class DirectMessage extends Workspace {
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    unique: true,
    sparse: true
  })
  userIds: string[]
}
