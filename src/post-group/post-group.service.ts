import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { CreatePostGroupDto } from 'src/dto/post-group-dto/create-post-group.dto';
import { UpdatePostGroupDto } from 'src/dto/post-group-dto/update-post-group.dto';
import { Channel } from 'src/shemas/channel.schema';
import { FriendRequest } from 'src/shemas/friend-request.schema';
import { Friend } from 'src/shemas/friend.schema';
import { Group } from 'src/shemas/group.schema';
import { PostChannel } from 'src/shemas/post-channel.schema';
import { PostGroup } from 'src/shemas/post-group.schema';
import { Post } from 'src/shemas/post.schema';
import { User } from 'src/shemas/user.schema';

@Injectable()
export class PostGroupService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Post.name)
    private readonly postModule: Model<Post>,
    @InjectModel(Group.name)
    private readonly groupModel: Model<Group>,
    @InjectModel(Channel.name)
    private readonly channelModel: Model<Channel>,
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequest>,
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
    @InjectModel(PostGroup.name)
    private readonly postGroupModel: Model<PostGroup>,
    @InjectModel(PostChannel.name)
    private readonly postChannelModel: Model<PostChannel>,
  ) {}

  async getPost(id: string) {
    const findPost = await this.postGroupModel.findOne({ _id: id });

    if (!findPost) {
      throw new NotFoundError('Post not found!');
    }

    return {
      message: 'Succsess!',
      post: findPost,
    };
  }

  async createPost(groupId: string, postGroupDto: CreatePostGroupDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findGroup = await this.groupModel.findOne({ _id: groupId });

    if (!findGroup) {
      throw new NotFoundError('Group not found!');
    }

    if (findGroup.adminId !== findUser.id) {
      throw new Error('You not have access!');
    }

    const payload = {
      groupId: findGroup.id,
      adminId: findUser.id,
      name: postGroupDto.name,
      text: postGroupDto.text,
      image: [],
    };

    await this.postGroupModel.create(payload);

    return {
      message: 'Succsessful!',
      post: payload,
    };
  }

  async updatePost(postId: string, updateGroupPost: UpdatePostGroupDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findPost = await this.postGroupModel.findOne({ _id: postId });

    if (!findPost) {
      throw new NotFoundError('Post not found!');
    }

    if (findPost.adminId !== findUser.id) {
      throw new Error('You dont have access!');
    }

    if (updateGroupPost?.name) {
      const updatePost = await this.postGroupModel.findOneAndUpdate(
        { _id: findPost.id },
        { name: updateGroupPost.name },
        { upsert: true, new: true },
      );

      return {
        message: 'Succsess!',
        post: updatePost,
      };
    }

    if (updateGroupPost?.text) {
      const updatePost = await this.postGroupModel.findOneAndUpdate(
        { _id: findPost.id },
        { text: updateGroupPost.text },
        { upsert: true, new: true },
      );

      return {
        message: 'Succsess!',
        post: updatePost,
      };
    }

    // If text & name
    if (updateGroupPost?.name && updateGroupPost?.text) {
      const updatePost = await this.postGroupModel.findOneAndUpdate(
        { _id: findPost },
        { name: updateGroupPost.name, text: updateGroupPost.text },
        { upsert: true, new: true },
      );

      return {
        message: 'Succsess!',
        post: updatePost,
      };
    }

    throw new Error('Referance error!');
  }

  async deletePost(postId: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not user!');
    }

    const findPost = await this.postGroupModel.findOne({ _id: postId });

    if (!findPost) {
      throw new NotFoundError('Post not found!');
    }

    if (findPost.adminId !== findUser.id) {
      throw new Error('You dont have access!');
    }

    const deletePost = await this.postGroupModel.findOneAndDelete({
      _id: findPost.id,
    });

    return {
      message: 'Succsess!',
      post: deletePost,
    };
  }
}
