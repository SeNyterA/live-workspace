import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export class User {
  _id: string

  @Prop()
  firebaseId?: string

  @Prop({ unique: true, required: true })
  userName: string

  @Prop({ unique: true, required: true })
  email: string

  @Prop()
  nickname?: string

  @Prop()
  avatar?: string

  @Prop()
  password: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date

  @Prop({ default: true })
  isAvailable: boolean
}
