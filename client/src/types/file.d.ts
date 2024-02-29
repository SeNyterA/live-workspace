import { TBase } from './base'

export enum EFileSourceType {
  AWS = 'AWS',
  Link = 'Link'
}
export type TFile = TBase & {
  path: string
  size: number
  sourceType: EFileSourceType
}
