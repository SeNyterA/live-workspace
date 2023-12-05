import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Workspace } from 'src/modules/workspace/workspace.schema'

@Schema()
export class Card extends Workspace {
  @Prop({ type: Types.ObjectId, ref: 'Board' })
  boardId: string

  @Prop({ type: Object, default: {} })
  data: {
    [key: string]: string | string[] | undefined
  }
}
