import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { WorkspaceSchema } from '../../workspace.schema'

export enum EFieldType {
  Date = 'Date',
  Number = 'Number',
  String = 'String',
  MultiPeople = 'MultiPeople',
  Select = 'Select',
  MultiSelect = 'MultiSelect',
  Link = 'Link',
  Email = 'Email',

  // Special field
  Assignees = 'Assignees',
  DueDate = 'DueDate'
}

@Schema()
export class Option {
  _id: string

  @Prop()
  title: string

  @Prop()
  color: string
}

@Schema()
export class Property {
  _id: string

  @Prop()
  title: string

  @Prop()
  fieldType: EFieldType

  @Prop({ type: [SchemaFactory.createForClass(Option)] })
  fieldOption?: Option[]
}

@Schema()
export class Board extends WorkspaceSchema {
  @Prop({ type: Types.ObjectId, ref: 'Team' })
  teamId: string

  @Prop({ type: [SchemaFactory.createForClass(Property)], default: [] })
  properties: Property[]
}

export const BoardSchema = SchemaFactory.createForClass(Board)
