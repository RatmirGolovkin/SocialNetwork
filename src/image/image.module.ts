import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from 'src/guards/constants/constants';
import { Post, postSchema } from 'src/shemas/post.schema';
import { Sub, subsSchema } from 'src/shemas/sub.schema';
import { User, userSchema } from 'src/shemas/user.schema';
import { imageSchema, Image } from 'src/shemas/image.schema';
import { commentSchema, Comment } from 'src/shemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: Sub.name, schema: subsSchema },
      { name: Image.name, schema: imageSchema },
      { name: Comment.name, schema: commentSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
