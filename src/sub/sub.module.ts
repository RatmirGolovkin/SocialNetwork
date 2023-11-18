import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from 'src/guards/constants/constants';
import { SubController } from './sub.controller';
import { SubService } from './sub.service';
import { User, userSchema } from 'src/shemas/user.schema';
import { Post, postSchema } from 'src/shemas/post.schema';
import { Sub, subsSchema } from 'src/shemas/sub.schema';
import { Channel, channelSchema } from 'src/shemas/channel.schema';
import { Group, groupSchema } from 'src/shemas/group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: Sub.name, schema: subsSchema },
      { name: Channel.name, schema: channelSchema },
      { name: Group.name, schema: groupSchema },
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
