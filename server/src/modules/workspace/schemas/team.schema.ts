import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Team {
  _id: string;

  @Prop()
  title: string;

  @Prop()
  description?: string;

  @Prop()
  avatar?: string;

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
  //#endregion
}

export const TeamSchema = SchemaFactory.createForClass(Team);
