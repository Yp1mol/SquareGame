import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './position.entity';
import { Room } from '../rooms/room.entity';
import { PositionsService } from './positions.service';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';
import { HistoryModule } from '../history/history.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position, Room]),
    forwardRef(() => RoomsModule),
    UsersModule,
    HistoryModule,
    NotificationsModule,
  ],
  providers: [PositionsService],
  exports: [PositionsService],
})
export class PositionsModule {}
