import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class DirectMessage {
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    unique: true,
    sparse: true,
  })
  userIds: string[];

  //#region common
  _id: string;

  @Prop()
  title: string;

  @Prop()
  description?: string;

  @Prop()
  avatar?: string;

  @Prop()
  path: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdById: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  modifiedById: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: true })
  isAvailable: boolean;
  //#endregion
}

export const DirectMessageSchema = SchemaFactory.createForClass(DirectMessage);
