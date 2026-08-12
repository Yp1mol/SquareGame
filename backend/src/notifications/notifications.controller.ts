import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('all')
  async index(@CurrentUser() userId: number) {
    return this.notificationsService.getAll(userId);
  }

  @Patch(':id/read')
  async update(@CurrentUser() userId: number, @Param('id') id: string) {
    return this.notificationsService.markAsRead(userId, Number(id));
  }

  @Delete()
  async destroy(@CurrentUser() userId: number, @Query('id') id?: string) {
    if (id) {
      return this.notificationsService.delete(userId, Number(id));
    }
    return this.notificationsService.deleteAll(userId);
  }
}
