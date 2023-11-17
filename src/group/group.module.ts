import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, postSchema } from 'src/shemas/post.schema';
import { Sub, subsSchema } from 'src/shemas/sub.schema';
import { User, userSchema } from 'src/shemas/user.schema';
import { Group, groupSchema } from 'src/shemas/group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: Sub.name, schema: subsSchema },
      { name: Group.name, schema: groupSchema },
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
