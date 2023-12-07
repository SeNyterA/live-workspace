import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Workspace } from 'src/modules/workspace/workspace.schema'

export enum EFieldType {
  Date = 'Date',
  Number = 'Number',
  String = 'String',
  People = 'People',
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
export class Property extends Workspace {
  @Prop({ type: Types.ObjectId, ref: 'Board' })
  boardId: string

  @Prop({ enum: EFieldType })
  fieldType: EFieldType

  @Prop({ type: [SchemaFactory.createForClass(Option)] })
  fieldOption?: Option[]
}
