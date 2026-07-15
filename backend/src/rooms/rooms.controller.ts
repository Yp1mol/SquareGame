import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PositionsService } from '../positions/positions.service';
import { RoomsService } from './rooms.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('rooms')
@UseGuards(AuthGuard)
export class RoomsController {
  constructor(
    @Inject(forwardRef(() => PositionsService))
    private readonly positionsService: PositionsService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post()
  async createRoom(
    @Body() body: { code: string; cost: number },
    @CurrentUser() userId: number,
  ) {
    const cost = body.cost || 1;
    return this.roomsService.create(body.code, userId, cost);
  }

  @Get()
  async getRoomsToJoin(@CurrentUser() userId: number) {
    return this.roomsService.findToJoin(userId);
  }

  @Get(':code/positions')
  async getPositions(
    @Param('code') code: string,
    @CurrentUser() userId: number,
  ) {
    return this.positionsService.findByRoomCode(code, userId);
  }

  @Get('mine')
  async getRooms(@CurrentUser() userId: number) {
    return this.roomsService.findMine(userId);
  }

  @Post(':code/positions')
  async savePositions(
    @Param('code') code: string,
    @Body() body: { positions: { unitId: string; x: number; y: number }[] },
    @CurrentUser() userId: number,
  ) {
    return this.positionsService.savePositions(code, body.positions, userId);
  }

  @Post(':code/join')
  async joinRoom(@Param('code') code: string, @CurrentUser() userId: number) {
    return this.roomsService.joinRoom(code, userId);
  }

  @Post(':code/leave')
  async leaveRoom(@Param('code') code: string, @CurrentUser() userId: number) {
    return this.roomsService.leaveRoom(code, userId);
  }

  @Post(':code/finish')
  async finishSetup(
    @Param('code') code: string,
    @CurrentUser() userId: number,
  ) {
    return this.positionsService.finishSetup(code, userId);
  }

  @Get(':code')
  async getRoom(@Param('code') code: string) {
    return this.roomsService.findByCode(code);
  }

  @Delete(':code')
  async deleteRoom(@Param('code') code: string, @CurrentUser() userId: number) {
    return this.roomsService.remove(code, userId);
  }
}
