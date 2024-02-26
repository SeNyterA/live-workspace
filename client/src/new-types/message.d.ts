import { TBase } from './base'
import { TFile } from './file'

export enum EMessageType {
  Normal = 'N',
  System = 'S'
}

export type TMessage = TBase & {
  type: EMessageType
  content: JSONContent
  reactions: {
    [userId: string]: string
  }
  isPinned: boolean
  attachments?: TFile[]
  targetId: string
  replyToId: string
  threadId: string
}
