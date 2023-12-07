import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Workspace } from 'src/modules/workspace/workspace.schema'

export enum EBlockType {
  Divider = 'Divider',
  Text = 'Text',
  Checkbox = 'Checkbox',
  Image = 'Image'
}

@Schema()
export class Block {
  _id: string

  @Prop({ enum: EBlockType })
  blockType: EBlockType

  @Prop()
  content?: string

  @Prop({ type: Boolean })
  isCheck?: boolean
}

@Schema()
export class Card extends Workspace {
  @Prop({ type: Types.ObjectId, ref: 'Board' })
  boardId: string

  @Prop({ type: Object, default: {} })
  data: {
    [key: string]: string | string[] | undefined
  }

  @Prop({ type: [SchemaFactory.createForClass(Block)], default: [] })
  blocks: Block[]
}
