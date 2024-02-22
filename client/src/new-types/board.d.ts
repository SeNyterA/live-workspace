import { JSONContent } from '@tiptap/react'
import { TBase } from './base'
import { TFile } from './file'

export type TCard = TBase & {
  title: string
  properties: {
    [key: string]: string | string[] | undefined
  }
  detail: JSONContent
  attachments: TFile[]
  boardId: string
}

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
  Assignees = 'Assignees',
  DueDate = 'DueDate'
}
export type TProperty = TBase & {
  title: string
  fieldType: EFieldType
  order: number
  boardId: string
}

export type TOption = TBase & {
  title: string
  color: string
  propertyId: string
  boardId: string
}
