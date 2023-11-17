import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../guards/constants/constants';
import { User, userSchema } from 'src/shemas/user.schema';
import { Post, postSchema } from 'src/shemas/post.schema';
import { Sub, subsSchema } from 'src/shemas/sub.schema';
import { Friend, FriendSchema } from 'src/shemas/friend.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: Sub.name, schema: subsSchema },
      { name: Friend.name, schema: FriendSchema },
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
