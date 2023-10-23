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
  @Get('get/subscription')
  getAllSubscriptions(@Request() req) {
    return this.subService.getAllSubscriptions(req);
  }

  // Get subscribers //
  @UseGuards(UserGuard)
  @Get('get/subscribers')
  getAllSubscribers(@Request() req) {
    return this.subService.getAllSubscribers(req);
  }

  // get subscribe //
  @UseGuards(UserGuard)
  @Post(':id')
  subscribe(@Param('id') id: string, @Request() req) {
    return this.subService.subscribe(id, req);
  }

  // Delete
  @UseGuards(UserGuard)
  @Put('delete/:id')
  unsubscribe(@Param(':id') id: string, @Request() req) {
    return this.subService.unsubscribe(id, req);
  }
}
