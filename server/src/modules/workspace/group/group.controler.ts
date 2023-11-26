import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { EMessageFor } from '../message/message.schema'
import { MessageService } from '../message/message.service'
import { UpdateWorkspaceDto } from '../workspace.dto'
import { TJwtUser } from '../workspace.gateway'
import { GroupDto } from './group.dto'
import { GroupService } from './group.service'

@Controller('workspace/groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly messageService: MessageService
  ) {}

  @Get(':id')
  findOne(@HttpUser() user: TJwtUser, @Param('id') id: string) {
    return this.groupService.getGroupById({
      id: id,
      userId: user.sub
    })
  }

  @Get()
  findAll(@HttpUser() user: TJwtUser) {
    return this.groupService.getGroupsByUserId(user.sub)
  }

  @Post()
  create(@HttpUser() user: TJwtUser, @Body() groupPayload: GroupDto) {
    return this.groupService._create({
      groupDto: groupPayload,
      userId: user.sub
    })
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @HttpUser() user: TJwtUser,
    @Body() groupPayload: UpdateWorkspaceDto
  ) {
    return this.groupService.update({
      id,
      userId: user.sub,
      groupPayload
    })
  }

  @Delete(':id')
  delete(@Param('id') id: string, @HttpUser() user: TJwtUser) {
    return this.groupService.delete({
      id,
      userId: user.sub
    })
  }

  @Post(':id/messages')
  sendMesage(
    @Param('id') id: string,
    @HttpUser() user: TJwtUser,
    @Body()
    messagePayload: {
      content: string
    }
  ) {
    return this.messageService._createForGroup({
      groupId: id,
      userId: user.sub,
      messagePayload
    })
  }

  @Get(':id/messages')
  messages(@Param('id') id: string, @HttpUser() user: TJwtUser) {
    return this.messageService._getMessages({
      messageReferenceId: id,
      userId: user.sub,
      messgaeFor: EMessageFor.Group
    })
  }
}
