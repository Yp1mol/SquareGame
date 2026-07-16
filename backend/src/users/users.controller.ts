import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  show(@CurrentUser() userId: number) {
    return this.usersService.findOne(userId);
  }

  @Patch('me')
  update(@CurrentUser() userId: number, @Body() body: { username: string }) {
    return this.usersService.updateUsername(userId, body.username);
  }
}
