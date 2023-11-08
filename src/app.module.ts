import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { SubModule } from './sub/sub.module';
import { CommentModule } from './comment/comment.module';
import { ImageModule } from './image/image.module';

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
  ],
})
export class AppModule {}
