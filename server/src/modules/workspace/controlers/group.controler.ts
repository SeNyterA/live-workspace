import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Group } from '../schemas/group.schema';
import { GroupService } from '../services/group.service';

@Controller('/workspace/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() group: Group) {
    return this.groupService.create(group);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() group: Partial<Group>) {
    return this.groupService.update(id, group);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
