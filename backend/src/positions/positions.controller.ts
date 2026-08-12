import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('rooms/:code')
@UseGuards(AuthGuard)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get('positions')
  async index(@Param('code') code: string, @CurrentUser() userId: number) {
    return this.positionsService.findByRoomCode(code, userId);
  }

  @Post('positions')
  async store(
    @Param('code') code: string,
    @Body()
    body: {
      positions: {
        unitId: string;
        cells: { x: number; y: number }[];
      }[];
    },
    @CurrentUser() userId: number,
  ) {
    return this.positionsService.savePositions(code, body.positions, userId);
  }
}
