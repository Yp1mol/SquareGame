import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users/me/credits')
@UseGuards(AuthGuard)
export class UserCreditsController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async show(@CurrentUser() userId: number) {
    return this.usersService.getCredits(userId);
  }

  @Post('add')
  async store(@CurrentUser() userId: number, @Body('amount') amount: number) {
    const addAmount = amount && amount > 0 ? amount : 1;

    return this.usersService.addCredits(userId, addAmount);
  }

  @Post('withdraw')
  async destroy(
    @CurrentUser() userId: number,
    @Body() body: { amount: number },
  ) {
    return this.usersService.withdrawCredits(userId, body.amount);
  }
}
