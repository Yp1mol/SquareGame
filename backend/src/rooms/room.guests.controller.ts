import { Controller, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('rooms/:code/guests')
@UseGuards(AuthGuard)
export class RoomGuestsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async store(@Param('code') code: string, @CurrentUser() userId: number) {
    return this.roomsService.joinRoom(code, userId);
  }

  @Delete()
  async destroy(@Param('code') code: string, @CurrentUser() userId: number) {
    return this.roomsService.leaveRoom(code, userId);
  }
}
