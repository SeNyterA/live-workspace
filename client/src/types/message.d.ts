import { TBase } from './base'
import { TFile } from './file'

export enum EMessageType {
  Normal = 'N',
  System = 'S'
}

export enum EMesssageFor {
  Channel = 'C',
  Direct = 'D',
  Group = 'G',
  Board = 'B'
}

export type TMessage = TBase & {
  type: EMessageType
  content: JSONContent
  reactions: {
    [userId: string]: string
  }
  for:EMesssageFor
  isPinned: boolean
  attachments?: TFile[]
  targetId: string
  replyToId: string
  threadId: string
}
