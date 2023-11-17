import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/shemas/user.schema';
import { Post, postSchema } from 'src/shemas/post.schema';
import { Group, groupSchema } from 'src/shemas/group.schema';
import { Channel } from 'diagnostics_channel';
import { channelSchema } from 'src/shemas/channel.schema';
import {
  FriendRequest,
  FriendRequestSchema,
} from 'src/shemas/friend-request.schema';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { Friend, FriendSchema } from 'src/shemas/friend.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: Group.name, schema: groupSchema },
      { name: Channel.name, schema: channelSchema },
      { name: FriendRequest.name, schema: FriendRequestSchema },
      { name: Friend.name, schema: FriendSchema },
    ]),
  ],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendsModule {}
