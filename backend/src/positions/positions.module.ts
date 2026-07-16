import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './position.entity';
import { Room } from '../rooms/room.entity';
import { PositionsService } from './positions.service';
import { UsersModule } from '../users/users.module';
import { HistoryModule } from '../history/history.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PositionsController } from './positions.controller';
import { SetupController } from './positions.setup.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position, Room]),
    UsersModule,
    HistoryModule,
    NotificationsModule,
  ],
  providers: [PositionsService],
  exports: [PositionsService],
  controllers: [PositionsController, SetupController],
})
export class PositionsModule {}
