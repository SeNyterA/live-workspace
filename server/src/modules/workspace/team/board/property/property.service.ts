import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Errors } from 'src/libs/errors'
import { UsersService } from 'src/modules/users/users.service'
import { MemberService } from 'src/modules/workspace/member/member.service'
import { MessageService } from 'src/modules/workspace/message/message.service'
import { WorkspaceService } from 'src/modules/workspace/workspace.service'
import { TeamService } from '../../team.service'
import { BoardService } from '../board.service'
import { PropertyDto } from './property.dto'
import { Property } from './property.schema'

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) readonly propertyModel: Model<Property>,

    readonly memberService: MemberService,
    @Inject(forwardRef(() => MessageService))
    readonly messageService: MessageService,
    @Inject(forwardRef(() => WorkspaceService))
    readonly workspaceService: WorkspaceService,
    @Inject(forwardRef(() => TeamService))
    readonly teamService: TeamService,
    @Inject(forwardRef(() => UsersService))
    readonly usersService: UsersService,
    @Inject(forwardRef(() => BoardService))
    readonly boardService: BoardService
  ) {}

  async _create({
    userId,
    boardId,
    payload
  }: {
    userId: string
    boardId: string
    payload: PropertyDto
  }) {
    const {
      permissions: {
        fieldAction: { create: createPermission }
      }
    } = await this.boardService.__getPermisstion({
      targetId: boardId,
      userId
    })

    if (!createPermission) {
      return {
        error: {
          code: Errors['User dont has permission to create property'],
          err: 'User dont has permission to create property',
          userId,
          boardId
        }
      }
    }

    const newProperty = await this.propertyModel.create({
      ...payload,
      boardId,
      createdById: userId,
      modifiedById: userId
    })

    console.log(newProperty)

    this.workspaceService.boardEmit({
      rooms: [boardId],
      boardData: [
        { type: 'property', action: 'create', data: newProperty.toJSON() }
      ]
    })

    return {
      data: newProperty
    }
  }
}
