import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SubService } from './sub.service';
import { UserGuard } from 'src/guards/user.guard';

@UseGuards(UserGuard)
@Controller('sub')
export class SubController {
  constructor(private readonly subService: SubService) {}

  @Get('get/user-group')
  getUserGroup(@Request() req) {
    return this.subService.getUserGroup(req);
  }

  @Get('get/user-channel')
  getUserChannel(@Request() req) {
    return this.subService.getUserChannel(req);
  }

  @Get('get/group/:userId')
  getGroup(@Param('userId') userId: string) {
    return this.subService.getGroup(userId);
  }

  @Get('get/channel/:userId')
  getChannel(@Param('userId') userId: string) {
    return this.subService.getChannel(userId);
  }

  @Post('group/:groupId')
  getGroupSub(@Param('groupId') groupId: string, @Request() req) {
    return this.subService.getGroupSub(groupId, req);
  }

  @Post('channel/:channelId')
  getChannelSub(@Param('channelId') channelId: string, @Request() req) {
    return this.subService.getChannelSub(channelId, req);
  }

  @Post('unsubscribe/group/:groupId')
  getGroupUnSub(@Param('groupId') groupId: string, @Request() req) {
    return this.subService.getGroupUnSub(groupId, req);
  }

  @Post('unsubscribe/channel/:channelId')
  getChannelUnSub(@Param('channelId') channelId: string, @Request() req) {
    return this.subService.getChannelUnSub(channelId, req);
  }
}
