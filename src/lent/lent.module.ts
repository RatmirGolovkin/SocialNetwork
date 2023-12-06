import { Module } from '@nestjs/common';
import { LentController } from './lent.controller';
import { LentService } from './lent.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/shemas/user.schema';
import { Post, postSchema } from 'src/shemas/post.schema';
import { Sub, subsSchema } from 'src/shemas/sub.schema';
import { Group, groupSchema } from 'src/shemas/group.schema';
import { Channel, channelSchema } from 'src/shemas/channel.schema';
import { Friend, FriendSchema } from 'src/shemas/friend.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: Sub.name, schema: subsSchema },
      { name: Group.name, schema: groupSchema },
      { name: Channel.name, schema: channelSchema },
      { name: Friend.name, schema: FriendSchema },
    ]),
  ],
  controllers: [LentController],
  providers: [LentService],
})
export class LentModule {}
