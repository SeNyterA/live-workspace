import { Body, Controller, Param, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { PropertyDto } from './property.dto'
import { PropertyService } from './property.service'

@Controller('workspace/boards/:boardId')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post('/properties')
  create(
    @HttpUser() user: TJwtUser,
    @Body() payload: PropertyDto,
    @Param('boardId') boardId: string
  ) {
    return this.propertyService._create({
      boardId,
      userId: user.sub,
      payload
    })
  }
}
