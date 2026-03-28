import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { Position } from '../positions/position.entity';
import { RoomsService } from './rooms.service';
import { PositionsService } from '../positions/positions.service';
import { RoomsController } from './rooms.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Position]), UsersModule],
  providers: [RoomsService, PositionsService],
  controllers: [RoomsController],
  exports: [RoomsService, PositionsService],
})
export class RoomsModule {}
