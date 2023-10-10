import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { MemberSchema, WorkspaceSchema } from '../../workspace.schema'

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
  @Prop({ type: [SchemaFactory.createForClass(Property)], default: [] })
  properties: Property[]

  @Prop({ type: [SchemaFactory.createForClass(MemberSchema)], default: [] })
  members: MemberSchema[]
}

export const BoardSchema = SchemaFactory.createForClass(Board)
