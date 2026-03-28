/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() req) {
    const userId = req.user.sub || req.user.id;

    return this.usersService.findOne(userId);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  updateMe(@Req() req, @Body() body: { username: string }) {
    const userId = req.user.sub || req.user.id;

    return this.usersService.updateUsername(userId, body.username);
  }

  @UseGuards(AuthGuard)
  @Get('credits')
  async getCredits(@Req() req) {
    const userId = req.user.sub || req.user.id;

    return this.usersService.getCredits(userId);
  }

  @UseGuards(AuthGuard)
  @Post('credits/add')
  async addCredits(@Req() req) {
    const userId = req.user.sub || req.user.id;

    return this.usersService.addCredits(userId, 1);
  }

  @UseGuards(AuthGuard)
  @Post('credits/withdraw')
  async withdrawCredits(@Req() req, @Body() body: { amount: number }) {
    const userId = req.user.sub || req.user.id;

    return this.usersService.withdrawCredits(userId, body.amount);
  }
}
