import { Body, Controller, Param, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { PropertyDto } from './property.dto'

@Controller('workspace/boards/:boardId')
export class ChannelController {
  constructor() {}

  @Post('/properties')
  create(
    @HttpUser() user: TJwtUser,
    @Body() propertyDto: PropertyDto,
    @Param('boardId') boardId: string
  ) {}
}
