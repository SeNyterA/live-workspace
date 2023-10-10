import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request
} from '@nestjs/common'
import { getUserId } from 'src/libs/getUserId'
import { EMessageFor } from '../message/message.schema'
import { MessageService } from '../message/message.service'
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../workspace.dto'
import { GroupService } from './group.service'

@Controller('workspace/groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly messageService: MessageService
  ) {}

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.groupService.getGroupById({
      id: id,
      userId: getUserId(req)
    })
  }

  @Get()
  findAll(@Request() req) {
    return this.groupService.getGroupsByUserId(getUserId(req))
  }

  @Post()
  create(@Request() req, @Body() groupPayload: CreateWorkspaceDto) {
    return this.groupService.create({
      group: groupPayload,
      userId: getUserId(req)
    })
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() groupPayload: UpdateWorkspaceDto
  ) {
    return this.groupService.update({
      id,
      userId: getUserId(req),
      groupPayload
    })
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.groupService.delete({
      id,
      userId: getUserId(req)
    })
  }

  @Post(':id/messages')
  sendMesage(
    @Param('id') id: string,
    @Request() req,
    @Body() messagePayload: any
  ) {
    return this.messageService._createForGroup({
      groupId: id,
      userId: getUserId(req),
      messagePayload
    })
  }

  @Get(':id/messages')
  messages(@Param('id') id: string, @Request() req) {
    return this.messageService._getMessages({
      messageReferenceId: id,
      userId: getUserId(req),
      messgaeFor: EMessageFor.Group
    })
  }
}
