import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { Channel } from 'src/shemas/channel.schema';
import { Friend } from 'src/shemas/friend.schema';
import { Group } from 'src/shemas/group.schema';
import { Post } from 'src/shemas/post.schema';
import { Sub } from 'src/shemas/sub.schema';
import { User } from 'src/shemas/user.schema';

@Injectable()
export class LentService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Post.name)
    private readonly postModule: Model<Post>,
    @InjectModel(Sub.name)
    private readonly subModel: Model<Sub>,
    @InjectModel(Group.name)
    private readonly groupModel: Model<Group>,
    @InjectModel(Channel.name)
    private readonly channelModel: Model<Channel>,
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
  ) {}

  async getLent(req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findUserSubs = await this.subModel.findOne({ userId: findUser.id });

    if (!findUserSubs) {
      throw new Error('User subs erorr!');
    }

    const findFriends = await this.friendModel.findOne({ userId: findUser.id });

    if (!findFriends) {
      throw new Error('User friend erorr!');
    }

    if (
      findUserSubs.subChannel.length <= 0 &&
      findUserSubs.subGroup.length <= 0 &&
      findFriends.friends.length <= 0
    ) {
      return 'You dont have subs group, channel and friends!';
    }

    const lent = [];

    const groupArr = findUserSubs.subGroup;

    const channelArr = findUserSubs.subChannel;

    const friendArr = findFriends.friends;
  }
}
