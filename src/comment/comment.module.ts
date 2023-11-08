import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, commentSchema } from '../shemas/comment.schema';
import { User, userSchema } from 'src/shemas/user.schema';
import { Post, postSchema } from 'src/shemas/post.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/guards/constants/constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: Comment.name, schema: commentSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
