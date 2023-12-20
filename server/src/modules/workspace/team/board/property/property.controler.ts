import { Body, Controller, Param, Patch, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { PropertyDto, UPropertyDto } from './property.dto'
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
    return this.propertyService.create({
      boardId,
      userId: user.sub,
      payload
    })
  }

  @Patch('/properties/:propertyId')
  update(
    @HttpUser() user: TJwtUser,
    @Body() payload: UPropertyDto,
    @Param('boardId') boardId: string,
    @Param('propertyId') propertyId: string
  ) {
    return this.propertyService.update({
      boardId,
      userId: user.sub,
      payload,
      propertyId
    })
  }
}
