import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export enum ETeamMemberType {
  Owner = 0,
  Admin = 1,
  Member = 2
}

@Schema()
export class TeamMember {
  _id: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string

  @Prop({ enum: ETeamMemberType, default: ETeamMemberType.Member })
  type: ETeamMemberType
}

@Schema()
export class Team {
  _id: string

  @Prop()
  title: string

  @Prop()
  description?: string

  @Prop()
  avatar?: string

  @Prop({ type: [SchemaFactory.createForClass(TeamMember)], default: [] })
  members: TeamMember[]

  //#region common
  @Prop()
  path: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdById: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  modifiedById: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date

  @Prop({ default: true })
  isAvailable: boolean
  //#endregion
}

export const TeamSchema = SchemaFactory.createForClass(Team)
