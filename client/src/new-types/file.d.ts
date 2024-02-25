import { TBase } from "./base"

export type TFile = TBase & {
  path: string
  size: number
}
