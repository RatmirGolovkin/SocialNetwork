import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChannelDto } from 'src/dto/channel-dto/create-channel.dto';
import { UpdateChannelDto } from 'src/dto/channel-dto/update-des-channel';
import { Channel } from 'src/shemas/channel.schema';
import { Group } from 'src/shemas/group.schema';
import { Post } from 'src/shemas/post.schema';
import { User } from 'src/shemas/user.schema';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Post.name)
    private readonly postModule: Model<Post>,
    @InjectModel(Group.name)
    private readonly groupModel: Model<Group>,
    @InjectModel(Channel.name)
    private readonly channelModel: Model<Channel>,
  ) {}

  async getChannel(id: string) {
    const findChannel = await this.channelModel.findOne({ _id: id });

    if (!findChannel) {
      throw new Error('Channel not found!');
    }

    return {
      channel: findChannel,
      admin: findChannel.adminId,
    };
  }

  async createChannel(createChannel: CreateChannelDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new Error('User not found!');
    }

    const findExistChannel = await this.channelModel.findOne({
      $and: [{ name: createChannel.name }, { adminId: findUser.id }],
    });

    if (findExistChannel) {
      throw new Error('This channel name already use!');
    }

    const payload = {
      name: createChannel.name,
      adminId: findUser.id,
      description: createChannel.description,
      image: [],
    };

    const save = await this.channelModel.create(payload);

    return {
      message: 'Succsess!',
      channel: save,
    };
  }

  async updateChannel(id: string, updateChannel: UpdateChannelDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    const findChannel = await this.channelModel.findOne({ _id: id });

    if (!findChannel) {
      throw new NotFoundException('Channel not found!');
    }

    if (updateChannel?.name) {
      const update = await this.channelModel.findOneAndUpdate(
        { _id: findChannel.id },
        { name: updateChannel.name },
        { upsert: true, new: true },
      );

      return {
        message: 'Name updated!',
        channel: update,
      };
    }

    if (updateChannel?.description) {
      const update = await this.channelModel.findOneAndUpdate(
        { _id: findChannel.id },
        { description: updateChannel.description },
        { upsert: true, new: true },
      );

      return {
        message: 'Description updated!',
        channel: update,
      };
    }

    throw new Error('Unknow error!');
  }

  async delete(id: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    const findChannel = await this.channelModel.findOne({ _id: id });

    if (!findChannel) {
      throw new NotFoundException('Channel not found!');
    }

    if (findChannel.adminId !== findUser.id) {
      throw new Error('You dont have access!');
    }

    const deleteChannel = await this.channelModel.findOneAndDelete({
      _id: findChannel.id,
    });

    return {
      message: 'Succsess!',
      channel: deleteChannel,
    };
  }
}
