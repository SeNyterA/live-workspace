import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { FieldProperty, FieldPropertySchema } from './field.schema';

@Schema()
export class Board {
  _id: string;

  @Prop({ type: [FieldPropertySchema] })
  properties: FieldProperty[];

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  //#region common
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
  //#region
}

export const BoardSchema = SchemaFactory.createForClass(Board);
