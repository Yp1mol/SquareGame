import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './db/data-source';
import { HistoryModule } from './history/history.module';
import { PositionsModule } from './positions/positions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    RoomsModule,
    HistoryModule,
    PositionsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
