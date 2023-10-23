import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, userSchema } from './schema/user.schema';
import { jwtConstants } from '../guards/constants/constants';
import { Post, postSchema } from 'src/post/schema/post.schema';
import {
  Subscription,
  subscriptionSchema,
} from 'src/sub/schema/subscription.schema';
import { UserPosts, userPostsSchema } from './schema/user-posts.schema';
import { Subscriber, subscriberSchema } from 'src/sub/schema/subscriber.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: Subscription.name, schema: subscriptionSchema },
      { name: Subscriber.name, schema: subscriberSchema },
      { name: UserPosts.name, schema: userPostsSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
