import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from '../guards/constants/constants';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post, postSchema } from './schema/post.schema';
import { User, userSchema } from 'src/user/schema/user.schema';
import { UserPosts, userPostsSchema } from 'src/user/schema/user-posts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: UserPosts.name, schema: userPostsSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
