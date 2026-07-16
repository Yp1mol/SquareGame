import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('rooms/:code/setups')
@UseGuards(AuthGuard)
export class SetupController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  async store(@Param('code') code: string, @CurrentUser() userId: number) {
    return this.positionsService.finishSetup(code, userId);
  }
}
