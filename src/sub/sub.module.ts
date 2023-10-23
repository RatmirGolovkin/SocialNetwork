import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from 'src/guards/constants/constants';
import { Post, postSchema } from 'src/post/schema/post.schema';
import { User, userSchema } from 'src/user/schema/user.schema';
import { SubController } from './sub.controller';
import { SubService } from './sub.service';
import { Subscription, subscriptionSchema } from './schema/subscription.schema';
import { Subscriber, subscriberSchema } from './schema/subscriber.schema';

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
