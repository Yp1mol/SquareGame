import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('rooms')
@UseGuards(AuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async store(
    @Body() body: { code: string; cost: number },
    @CurrentUser() userId: number,
  ) {
    return this.roomsService.create(body.code, userId, body.cost);
  }

  @Get()
  async index(@Query('my') myOnly: boolean, @CurrentUser() userId: number) {
    if (myOnly) {
      return this.roomsService.findMine(userId);
    }
    return this.roomsService.findToJoin(userId);
  }

  @Get(':code')
  async show(@Param('code') code: string) {
    return this.roomsService.findByCode(code);
  }

  @Delete(':code')
  async destroy(@Param('code') code: string, @CurrentUser() userId: number) {
    return this.roomsService.remove(code, userId);
  }
}
