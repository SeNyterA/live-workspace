import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { MemberBase, WorkspaceBase } from '../../common.schema'

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

@Schema()
export class FieldProperty {
  _id: string

  @Prop()
  title: string

  @Prop()
  fieldType: FieldType

  @Prop({ type: [SchemaFactory.createForClass(Option)] })
  fieldOption?: Option[]
}

@Schema()
export class Board extends WorkspaceBase {
  @Prop({ type: [SchemaFactory.createForClass(FieldProperty)] })
  properties: FieldProperty[]

  @Prop({ type: [SchemaFactory.createForClass(MemberBase)], default: [] })
  members: MemberBase[]
}

export const BoardSchema = SchemaFactory.createForClass(Board)
