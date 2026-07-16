import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserCreditsController } from './user.credits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), NotificationsModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController, UserCreditsController],
})
export class UsersModule {}
