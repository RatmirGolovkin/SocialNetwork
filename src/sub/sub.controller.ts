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
  getUserGroup() {}

  @Get('get/user-channel')
  getUserChannel() {}

  @Get('get/group/:userId')
  getGroup() {}

  @Get('get/channel/:userId')
  getChannel() {}

  @Post('subscribe/group/:groupId')
  getGroupSub(@Param('gruopId') groupId: string, @Request() req) {
    return this.subService.getGroupSub(groupId, req);
  }

  @Post('subscribe/channel/:channelId')
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
