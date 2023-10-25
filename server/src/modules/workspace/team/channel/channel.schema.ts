import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { EStatusType, Workspace } from '../../workspace.schema'

@Schema()
export class Channel extends Workspace {
  @Prop({ type: Types.ObjectId, ref: 'Team' })
  teamId: string

  @Prop({ type: String, enum: EStatusType })
  channelType: EStatusType

  @Prop()
  path: string
}
