/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('all')
  async getAll(@Req() req: any) {
    const userId = (req.user?.sub || req.user?.id) as number;

    return this.notificationsService.getAll(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    const userId = (req.user?.sub || req.user?.id) as number;

    return this.notificationsService.markAsRead(userId, Number(id));
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    const userId = (req.user?.sub || req.user?.id) as number;

    return this.notificationsService.delete(userId, Number(id));
  }

  @Delete()
  async deleteAll(@Req() req: any) {
    const userId = (req.user?.sub || req.user?.id) as number;

    return this.notificationsService.deleteAll(userId);
  }
}
