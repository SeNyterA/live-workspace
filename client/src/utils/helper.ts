import { JSONContent } from '@tiptap/react'
import { getAppValue } from '../redux/store'
import {
  EMemberRole,
  RoleWeights,
  TMember,
  TProperty,
  TPropertyOption,
  TWorkspace
} from '../types'

export const cleanObj = <T extends Record<string, any>>(
  params: T
): Record<string, string> =>
  Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== '' && value !== null
    )
    .reduce(
      (acc, [key, value]) => {
        acc[key] = String(value)
        return acc
      },
      {} as Record<string, string>
    )

export const generateId = () => {
  return Math.random().toString(36).substring(7)
}

export const getItemsWithMatchingKey = (
  data: JSONContent,
  key: string
): JSONContent[] => {
  const result: JSONContent[] = []

  const traverse = (node: JSONContent) => {
    if (node.type === key) {
      result.push(node)
    }

    if (node.content) {
      for (const child of node.content) {
        traverse(child)
      }
    }
  }

  traverse(data)

  return result
}

export const updateLabelMention = (json: JSONContent): JSONContent => {
  const updatedJson = { ...json }

  const traverseAndUpdate = (node: JSONContent): JSONContent => {
    return {
      ...node,
      attrs:
        node.attrs && node.attrs.id && node.type === 'mention'
          ? {
              ...node.attrs,
              label:
                getAppValue(
                  state => state.workspace.users[node.attrs!.id!]?.userName
                ) || node.attrs.id
            }
          : undefined,

      content: node?.content?.map(traverseAndUpdate)
    }
  }

  return traverseAndUpdate(updatedJson)
}

export const arrayToObject = <
  T extends { [key in K]?: string },
  K extends keyof T
>(
  array: T[],
  key: K
): { [key: string]: T } => {
  return array.reduce(
    (obj, item) => {
      if (item[key]) {
        obj[item[key] as string] = item
      }
      return obj
    },
    {} as { [key: string]: T }
  )
}

export const membersToObject = (members: TMember[]) => {
  return members.reduce(
    (obj, member) => {
      obj[`${member.workspaceId}_${member.userId}`] = member
      return obj
    },
    {} as { [key: string]: TMember }
  )
}

export const hasPermissionToOperate = ({
  operatorRole,
  targetRole = EMemberRole.Member
}: {
  operatorRole: EMemberRole
  targetRole?: EMemberRole
}) => {
  if (
    RoleWeights[operatorRole] >= RoleWeights[targetRole] &&
    RoleWeights[operatorRole] > RoleWeights[EMemberRole.Member]
  ) {
    return {
      operatorRole,
      targetRole,
      enabled: true,
      operatorWeight: RoleWeights[operatorRole],
      targetRoleWeight: RoleWeights[targetRole]
    }
  }
  return { operatorRole, targetRole, enabled: false }
}
