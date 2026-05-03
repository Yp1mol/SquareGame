/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Delete,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PositionsService } from '../positions/positions.service';
import { RoomsService } from './rooms.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('rooms')
export class RoomsController {
  constructor(
    @Inject(forwardRef(() => PositionsService))
    private positionsService: PositionsService,
    private roomsService: RoomsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createRoom(
    @Body() body: { code: string; cost: number },
    @Req() req: any,
  ) {
    const userId = (req.user?.sub || req.user?.id) as number;
    const cost = body.cost || 1;
    return this.roomsService.create(body.code, userId, cost);
  }

  @Get(':code/positions')
  @UseGuards(AuthGuard)
  async getPositions(@Param('code') code: string, @Req() req: any) {
    const userId = (req.user?.sub || req.user?.id) as number;

    return this.positionsService.findByRoomCode(code, userId);
  }

  @Get('mine')
  @UseGuards(AuthGuard)
  async getRooms(@Req() req: any) {
    const userId = (req.user?.sub || req.user?.id) as number;

    return this.roomsService.findMine(userId);
  }

  @Post(':code/positions')
  @UseGuards(AuthGuard)
  async savePositions(
    @Param('code') code: string,
    @Body() body: { positions: { unitId: string; x: number; y: number }[] },
    @Req() req: any,
  ) {
    const userId = (req.user?.sub || req.user?.id) as number;

    return this.positionsService.savePositions(code, body.positions, userId);
  }

  @Post(':code/join')
  @UseGuards(AuthGuard)
  async joinRoom(@Param('code') code: string, @Req() req: any) {
    const userId = (req.user?.sub || req.user?.id) as number;

    return this.roomsService.joinRoom(code, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getRoomsToJoin(@Req() req: any) {
    const userId = (req.user?.sub || req.user?.id) as number;
    const rooms = await this.roomsService.findToJoin(userId);

    return rooms;
  }

  @Delete(':code')
  @UseGuards(AuthGuard)
  async deleteRoom(@Param('code') code: string, @Req() req: any) {
    const userId = (req.user?.sub || req.user?.id) as number;

    return this.roomsService.remove(code, userId);
  }

  @Post(':code/finish')
  @UseGuards(AuthGuard)
  async finishSetup(@Param('code') code: string, @Req() req: any) {
    const userId = (req.user?.sub || req.user?.id) as number;
    return this.positionsService.finishSetup(code, userId);
  }

  @Get(':code')
  @UseGuards(AuthGuard)
  async getRoom(@Param('code') code: string) {
    return this.roomsService.findByCode(code);
  }
}
