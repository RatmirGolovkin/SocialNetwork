import { Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { LentService } from './lent.service';
import { UserGuard } from 'src/guards/user.guard';

@Controller('lent')
export class LentController {
  constructor(private readonly lentService: LentService) {}

  @UseGuards(UserGuard)
  @Get()
  getLent(@Request() req) {
    return this.lentService.getLent(req);
  }

  @UseGuards(UserGuard)
  @Get('recomendation')
  getRecomendationLent() {}

  @UseGuards(UserGuard)
  @Put('update')
  updateLent() {}

  @UseGuards(UserGuard)
  @Put('update/recomendation')
  updateRecLent() {}
}
