import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { Resource, ResourceSchema } from 'src/schemas/resource.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { TasksService } from 'src/tasks/tasks.service';
import { FinanceService } from './finance/finance.service';

@Module({
  imports: [
    MailModule,
    CacheModule.register(),
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
  providers: [TasksService, FinanceService],
  exports: [MailModule, FinanceService],
})
export class SharedModule {}
