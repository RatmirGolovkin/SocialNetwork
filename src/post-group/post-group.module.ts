import { Module } from '@nestjs/common';
import { PostGroupService } from './post-group.service';
import { PostGroupController } from './post-group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/shemas/user.schema';
import { Post, postSchema } from 'src/shemas/post.schema';
import { Group, groupSchema } from 'src/shemas/group.schema';
import { Channel, channelSchema } from 'src/shemas/channel.schema';
import {
  FriendRequest,
  FriendRequestSchema,
} from 'src/shemas/friend-request.schema';
import { Friend, FriendSchema } from 'src/shemas/friend.schema';
import { PostGroup, postGroupSchema } from 'src/shemas/post-group.schema';
import { PostChannel, postChannelSchema } from 'src/shemas/post-channel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: Group.name, schema: groupSchema },
      { name: Channel.name, schema: channelSchema },
      { name: FriendRequest.name, schema: FriendRequestSchema },
      { name: Friend.name, schema: FriendSchema },
      { name: PostGroup.name, schema: postGroupSchema },
      { name: PostChannel.name, schema: postChannelSchema },
    ]),
  ],
  providers: [PostGroupService],
  controllers: [PostGroupController],
})
export class PostGroupModule {}
