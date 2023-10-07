import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum FieldType {
  Date = 'Date',
  Number = 'Number',
  String = 'String',
  MultiPeople = 'MultiPeople',
  Select = 'Select',
  MultiSelect = 'MultiSelect',
  Link = 'Link',
}

@Schema()
export class Option {
  _id: string;

  @Prop()
  title: string;

  @Prop()
  color: string;
}

export const OptionSchema = SchemaFactory.createForClass(Option);

@Schema()
export class FieldProperty {
  _id: string;

  @Prop()
  title: string;

  @Prop()
  fieldType: FieldType;

  @Prop({ type: [OptionSchema] })
  fieldOption?: Option[];
}

export const FieldPropertySchema = SchemaFactory.createForClass(FieldProperty);
