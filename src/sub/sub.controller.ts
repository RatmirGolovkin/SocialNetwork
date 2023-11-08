import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SubService } from './sub.service';
import { UserGuard } from 'src/guards/user.guard';

@Controller('sub')
export class SubController {
  constructor(private readonly subService: SubService) {}

  // Get subscriptions (Подписки) //
  @UseGuards(UserGuard)
  @Get('get')
  getAllSubscriptions(@Request() req) {
    return this.subService.getAll(req);
  }

  // get subscribe //
  @UseGuards(UserGuard)
  @Post(':id')
  subscribe(@Param('id') id: string, @Request() req) {
    return this.subService.subscribe(id, req);
  }

  // Unsubscribe
  @UseGuards(UserGuard)
  @Put('unsubscribe/:id')
  unsubscribe(@Param('id') id: string, @Request() req) {
    console.log(id);
    return this.subService.unsubscribe(id, req);
  }
}
