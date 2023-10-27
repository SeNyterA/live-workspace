export type TWorkspacePlayload = {
  title: string
  description?: string
  avatar?: string
}

export type TWorkspace = {
  _id: string
  title: string
  description?: string
  avatar?: string
  createdById: string
  modifiedById: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
}
