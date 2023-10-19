import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, userSchema } from './schema/user.schema';
import { jwtConstants } from '../guards/constants/constants';
import { Post, postSchema } from 'src/post/schema/post.schema';
import { Sub, subSchema } from 'src/sub/schema/sub.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Post.name, schema: postSchema },
      { name: Sub.name, schema: subSchema },
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
