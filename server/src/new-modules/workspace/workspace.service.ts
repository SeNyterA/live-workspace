import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as crypto from 'crypto-js'
import { Card } from 'src/entities/board/card.entity'
import { Property } from 'src/entities/board/property.entity'
import { EMemberRole, EMemberType, Member } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import { Workspace, WorkspaceType } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { Repository } from 'typeorm'

export type TWorkspaceSocket = {
  action: 'create' | 'update' | 'delete'
  data: Workspace
}

export type TBoardEmit = {
  action: 'create' | 'update' | 'delete'
} & ({ data: Property; type: 'property' } | { data: Card; type: 'card' })

export const generateRandomHash = (
  inputString = Math.random().toString()
): string => {
  const hash = crypto.SHA256(inputString).toString()
  const truncatedHash = hash.substring(0, 8)
  return truncatedHash
}

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,

    @InjectRepository(Member)
    private readonly memberceRepository: Repository<Member>
  ) {}

  async createTeam({
    user,
    workspace
  }: {
    workspace: Workspace
    user: TJwtUser
  }) {
    const newWorkspace = await this.workspaceRepository.save(
      this.workspaceRepository.create({
        ...workspace,
        type: WorkspaceType.Team,
        displayUrl: generateRandomHash(),
        createdById: user.sub,
        modifiedById: user.sub
      })
    )

    const member = await this.memberceRepository.save(
      this.memberceRepository.create({
        userId: user.sub,
        targetId: newWorkspace._id,
        role: EMemberRole.Owner,
        type: EMemberType.Team,
        createdById: user.sub,
        modifiedById: user.sub
      })
    )

    return {
      workspace: newWorkspace,
      member
    }
  }
}
