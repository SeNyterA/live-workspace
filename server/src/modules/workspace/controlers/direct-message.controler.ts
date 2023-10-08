import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { DirectMessage } from '../schemas/direct-message.schema'
import { DirectMessageService } from '../services/direct-message.service'

@Controller('/workspace/direct-messages')
export class DirectMessageController {
  constructor(private readonly directMessageService: DirectMessageService) {}

  @Post()
  create(@Body() directMessage: DirectMessage) {
    return this.directMessageService.create(directMessage)
  }

  @Get()
  findAll() {
    return this.directMessageService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directMessageService.findById(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() directMessage: Partial<DirectMessage>
  ) {
    return this.directMessageService.update(id, directMessage)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.directMessageService.remove(id)
  }
}
