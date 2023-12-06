import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { Channel } from 'src/shemas/channel.schema';
import { Group } from 'src/shemas/group.schema';
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
    @InjectModel(Channel.name)
    private readonly channelModel: Model<Channel>,
    @InjectModel(Group.name)
    private readonly groupModel: Model<Group>,
  ) {}

  async getUserGroup(req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findUserSubs = await this.subModel.findOne({ userId: findUser.id });

    if (!findUserSubs) {
      throw new NotFoundError('User subs error');
    }

    if (findUserSubs.subGroup.length <= 0) {
      return 'Your group list is empty!';
    }

    return {
      user: findUser.name,
      group: findUserSubs.subGroup,
    };
  }

  async getUserChannel(req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findUserSubs = await this.subModel.findOne({ userId: findUser.id });

    if (!findUserSubs) {
      throw new NotFoundError('User subs error!');
    }

    if (findUserSubs.subChannel.length <= 0) {
      return 'Your channel list is empty!';
    }

    return {
      user: findUser.name,
      channel: findUserSubs.subChannel,
    };
  }

  // get users group
  async getGroup(userId: string) {
    const findUser = await this.userModel.findOne({ _id: userId });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findUserSubs = await this.subModel.findOne({ userId: findUser.id });

    if (!findUserSubs) {
      throw new NotFoundError('User subs error!');
    }

    if (findUserSubs.subGroup.length <= 0) {
      return 'This user not have any group!';
    }

    return {
      user: findUser.name,
      group: findUserSubs.subGroup,
    };
  }

  // get users channel
  async getChannel(userId: string) {
    const findUser = await this.userModel.findOne({ _id: userId });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findUserSubs = await this.subModel.findOne({ userId: findUser.id });

    if (!findUserSubs) {
      throw new NotFoundError('User subs error!');
    }

    if (findUserSubs.subChannel.length <= 0) {
      return 'This user not have any channel!';
    }

    return {
      user: findUser.id,
      channel: findUserSubs.subChannel,
    };
  }

  async getGroupSub(groupId: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findGroup = await this.groupModel.findOne({ _id: groupId });

    if (!findGroup) {
      throw new NotFoundError('Group not found!');
    }

    if (findGroup.adminId === findUser.id) {
      return 'You cant subscribe on this group!';
    }

    const findSubSchemas = await this.subModel.findOne({ userId: findUser.id });

    if (!findSubSchemas) {
      throw new NotFoundError('Sub schema not found!');
    }

    const memberArr = findGroup.members;

    const newMember = {
      userName: findUser.name,
      userId: findUser.id,
    };

    memberArr.push(newMember);

    await this.groupModel.findOneAndUpdate(
      { _id: findGroup.id },
      { members: memberArr },
      { upsert: true, new: true },
    );

    const subArr = findSubSchemas.subGroup;

    const newSub = {
      name: findGroup.name,
      groupId: findGroup.id,
    };

    subArr.push(newSub);

    await this.subModel.findOneAndUpdate(
      { _id: findSubSchemas.id },
      { subGroup: subArr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsessful subscribed!',
      group: findGroup.name,
      user: findUser.name,
    };
  }

  async getChannelSub(channelId: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findChannel = await this.channelModel.findOne({ _id: channelId });

    if (!findChannel) {
      throw new NotFoundError('Channel not found!');
    }

    if (findUser.id === findChannel.adminId) {
      return 'You cant subscribe on this channel!';
    }

    const findSubSchemas = await this.subModel.findOne({ userId: findUser.id });

    if (!findSubSchemas) {
      throw new NotFoundError('Sub schema not found!');
    }

    const memberArr = findChannel.members;

    const newMember = {
      userName: findUser.name,
      userId: findUser.id,
    };

    memberArr.push(newMember);

    await this.channelModel.findOneAndUpdate(
      { _id: findChannel.id },
      { members: memberArr },
      { upsert: true, new: true },
    );

    const subArr = findSubSchemas.subChannel;

    const newSub = {
      name: findChannel.name,
      channelId: findChannel.id,
    };

    subArr.push(newSub);

    await this.subModel.findOneAndUpdate(
      { _id: findSubSchemas.id },
      { subChannel: subArr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsessful subscribed!',
      channel: findChannel.name,
      user: findUser.name,
    };
  }

  async getGroupUnSub(groupId: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findSubSchemas = await this.subModel.findOne({ userId: findUser.id });

    if (!findSubSchemas) {
      throw new NotFoundError('Sub schema not found!');
    }

    const findGroup = await this.groupModel.findOne({ _id: groupId });

    if (!findGroup) {
      throw new NotFoundError('Group not found!');
    }

    const subArr = findSubSchemas.subGroup;

    subArr.splice(
      subArr.indexOf({ name: findGroup.name, groupId: findGroup.id }),
    );

    await this.subModel.findOneAndUpdate(
      { userId: findUser.id },
      { subGroup: subArr },
      { upsert: true, new: true },
    );

    const groupArr = findGroup.members;

    groupArr.splice(
      groupArr.indexOf({ userName: findUser.name, userId: findUser.id }),
    );

    await this.groupModel.findOneAndUpdate(
      { _id: findGroup.id },
      { members: groupArr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsessful!',
      group: findGroup.name,
      user: findUser.name,
    };
  }

  async getChannelUnSub(channelId: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findSubSchemas = await this.subModel.findOne({ userId: findUser.id });

    if (!findSubSchemas) {
      throw new NotFoundError('Sub schema not found!');
    }

    const findChannel = await this.channelModel.findOne({ _id: channelId });

    if (!findChannel) {
      throw new NotFoundError('Group not found!');
    }

    const subArr = findSubSchemas.subChannel;

    subArr.splice(
      subArr.indexOf({ name: findChannel.name, channelId: findChannel.id }),
    );

    await this.subModel.findOneAndUpdate(
      { userId: findUser.id },
      { subGroup: subArr },
      { upsert: true, new: true },
    );

    const channelArr = findChannel.members;

    channelArr.splice(
      channelArr.indexOf({ userName: findUser.name, userId: findUser.id }),
    );

    await this.channelModel.findOneAndUpdate(
      { _id: findChannel.id },
      { members: channelArr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsessful!',
      channel: findChannel.name,
      user: findUser.name,
    };
  }
}
