import { MemberRole } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

class CreateMemberDto {
  @IsString()
  userId: string
}

class UpdateMemberDto {
  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole
}
