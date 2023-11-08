import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from 'src/guards/constants/constants';
import { SubController } from './sub.controller';
import { SubService } from './sub.service';
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
  providers: [SubService],
  controllers: [SubController],
})
export class SubModule {}
