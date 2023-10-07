import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Card {
  _id: string;

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

export const CardSchema = SchemaFactory.createForClass(Card);
