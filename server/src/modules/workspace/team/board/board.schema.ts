import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export enum FieldType {
  Date = 'Date',
  Number = 'Number',
  String = 'String',
  MultiPeople = 'MultiPeople',
  Select = 'Select',
  MultiSelect = 'MultiSelect',
  Link = 'Link'
}

@Schema()
export class Option {
  _id: string

  @Prop()
  title: string

  @Prop()
  color: string
}

export const OptionSchema = SchemaFactory.createForClass(Option)

@Schema()
export class FieldProperty {
  _id: string

  @Prop()
  title: string

  @Prop()
  fieldType: FieldType

  @Prop({ type: [OptionSchema] })
  fieldOption?: Option[]
}

export const FieldPropertySchema = SchemaFactory.createForClass(FieldProperty)

@Schema()
export class Board {
  _id: string

  @Prop({ type: [FieldPropertySchema] })
  properties: FieldProperty[]

  @Prop({ required: true })
  title: string

  @Prop()
  description?: string

  //#region common
  @Prop()
  path: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdById: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  modifiedById: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date

  @Prop({ default: true })
  isAvailable: boolean
  //#region
}

export const BoardSchema = SchemaFactory.createForClass(Board)
