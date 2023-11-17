import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/shemas/post.schema';
import { Sub } from 'src/shemas/sub.schema';
import { User } from 'src/shemas/user.schema';

@Injectable()
export class SubService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    @InjectModel(Sub.name)
    private readonly subModel: Model<Sub>,
  ) {}
}
