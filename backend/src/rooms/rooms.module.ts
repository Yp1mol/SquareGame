import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RoomGuestsController } from './room.guests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), UsersModule, NotificationsModule],
  providers: [RoomsService],
  controllers: [RoomsController, RoomGuestsController],
  exports: [RoomsService],
})
export class RoomsModule {}
