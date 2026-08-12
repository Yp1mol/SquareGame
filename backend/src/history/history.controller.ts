import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get('me')
  async index(@CurrentUser() userId: number) {
    return this.historyService.getUserHistory(userId);
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    return this.historyService.findById(Number(id));
  }
  @Delete()
  async destroy(@CurrentUser() userId: number) {
    return this.historyService.deleteAll(userId);
  }
}
