import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { Resource, ResourceSchema } from 'src/schemas/resource.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { SharedModule } from 'src/shared/shared.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MailModule,
    SharedModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        collection: 'users',
      },
      {
        name: Resource.name,
        schema: ResourceSchema,
        collection: 'resources',
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
