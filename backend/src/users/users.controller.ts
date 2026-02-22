import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard'; 

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard) 
  @Get('me')
  getMe(@Req() req) {
    console.log('User Payload:', req.user); 
    
    const userId = req.user.sub || req.user.id; 
    return this.usersService.findOne(userId);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  updateMe(@Req() req, @Body() body: { username: string }) {
    const userId = req.user.sub || req.user.id;
    return this.usersService.updateUsername(userId, body.username);
  }
}