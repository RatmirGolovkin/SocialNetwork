import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserGuard } from 'src/guards/user.guard';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendServise: FriendService) {}

  @UseGuards(UserGuard)
  @Get('get/my-friends')
  getMyFriends(@Request() req) {
    return this.friendServise.getMyFriends(req);
  }

  @UseGuards(UserGuard)
  @Get('get/friends/:id')
  getUserFriends(@Param('id') id: string, @Request() req) {
    return this.friendServise.getUserFriends(id, req);
  }

  @UseGuards(UserGuard)
  @Post('send/:receiverId')
  sendFriendReq(@Param('receiverId') receiverId: string, @Request() req) {
    return this.friendServise.sendFriendReq(receiverId, req);
  }

  @UseGuards(UserGuard)
  @Post('accept/:requestId')
  acceptFriendRequest(@Param('requestId') requestId: string, @Request() req) {
    return this.friendServise.acceptFriendRequest(requestId, req);
  }

  @UseGuards(UserGuard)
  @Post('decline/:requestId')
  declineFriendRequest(@Param('requestId') requestId: string, @Request() req) {
    return this.friendServise.declineFriendRequest(requestId, req);
  }

  @UseGuards(UserGuard)
  @Delete('/delete/:friendId')
  deleteFriend(@Param('friendId') friendId: string, @Request() req) {
    return this.friendServise.deleteFriend(friendId, req);
  }
}
