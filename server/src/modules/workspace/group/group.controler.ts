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
import { CreateGroupDto, UpdateGroupDto } from './group.dto'
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
  create(@Request() req, @Body() groupPayload: CreateGroupDto) {
    return this.groupService.create({
      group: groupPayload,
      userId: getUserId(req)
    })
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() groupPayload: UpdateGroupDto
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
