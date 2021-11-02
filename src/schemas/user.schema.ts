import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Resource } from './resource.schema';
export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop({
    type: [
      {
        min: { type: Number },
        max: { type: Number },
        resource: { type: MongooseSchema.Types.ObjectId, ref: 'Resource' },
      },
    ],
  })
  resources: { min: number; max: number; resource: Resource }[];
}
export const UserSchema = SchemaFactory.createForClass(User);
