/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getMyHistory(@Req() req: any) {
    const userId = (req.user?.sub || req.user?.id) as number;
    return this.historyService.getUserHistory(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getBattleById(@Param('id') id: string) {
    const battleId = parseInt(id, 10);

    return this.historyService.findById(battleId);
  }
}
