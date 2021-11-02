import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
@Module({
  imports: [
    UserModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
