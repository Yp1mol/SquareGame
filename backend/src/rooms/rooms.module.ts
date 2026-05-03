import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { UsersModule } from '../users/users.module';
import { PositionsModule } from '../positions/positions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    UsersModule,
    forwardRef(() => PositionsModule),
  ],
  providers: [RoomsService],
  controllers: [RoomsController],
  exports: [RoomsService],
})
export class RoomsModule {}
