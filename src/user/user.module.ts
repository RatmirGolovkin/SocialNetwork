import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../guards/constants/constants';
import { User, userSchema } from 'src/shemas/user.schema';
import { Post, postSchema } from 'src/shemas/post.schema';
import {
  Subscription,
  subscriptionSchema,
} from 'src/shemas/subscription.schema';
import { Subscriber, subscriberSchema } from 'src/shemas/subscriber.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: Subscription.name, schema: subscriptionSchema },
      { name: Subscriber.name, schema: subscriberSchema },
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
