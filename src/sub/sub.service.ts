import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/post/schema/post.schema';
import { User } from 'src/user/schema/user.schema';
import { Sub } from './schema/sub.schema';

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

  // Get subs //
  async getAllSubscriptions(req) {
    console.log(req);
  }

  // Subscribe //
  async subscribe(id: string, req) {
    const findUserSubs = await this.subModel.findOne({ _id: id });

    const subscriberId = { id: req.user.id };

    const updateUserSubscriber = await this.subModel.findByIdAndUpdate();

    // Добавлять юзера в подписчики другого юзера по айди, загружая айди в массив в дб //
  }
}
