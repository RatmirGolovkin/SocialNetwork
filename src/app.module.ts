import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { SubModule } from './sub/sub.module';
import { CommentModule } from './comment/comment.module';
import { ImageModule } from './image/image.module';
import { GroupModule } from './group/group.module';
import { ChannelModule } from './channel/channel.module';
import { FriendsModule } from './friend/friend.module';
import { LentModule } from './lent/lent.module';
import { PostGroupModule } from './post-group/post-group.module';
import { PostChannelModule } from './post-channel/post-channel.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:rootpassword@cluster0.zbzcg3y.mongodb.net/?retryWrites=true&w=majority',
    ),
    UserModule,
    PostModule,
    SubModule,
    CommentModule,
    ImageModule,
    GroupModule,
    ChannelModule,
    FriendsModule,
    LentModule,
    PostGroupModule,
    PostChannelModule,
  ],
})
export class AppModule {}
