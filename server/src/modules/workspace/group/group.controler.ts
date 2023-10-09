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
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../workspace.dto'
import { GroupService } from './group.service'

@Controller('workspace/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

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
}
