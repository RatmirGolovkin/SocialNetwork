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
export class PostChannelService {
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
    const post = await this.postChannelModel.findOne({ _id: id });

    if (!post) {
      throw new NotFoundError('Post not found!');
    }

    return post;
  }

  async createPost(channelId: string, postChannelDto: CreatePostGroupDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findChannel = await this.channelModel.findOne({ _id: channelId });

    if (!findChannel) {
      throw new NotFoundError('Channel not found!');
    }

    if (findChannel.adminId !== findUser.id) {
      throw new Error('You dont have access!');
    }

    const payload = {
      channelId: findChannel.id,
      adminId: findUser.id,
      name: postChannelDto.name,
      text: postChannelDto.text,
      images: [],
    };

    await this.postChannelModel.create(payload);

    return {
      message: 'Succsess!',
      post: payload,
    };
  }

  async updatePost(
    postId: string,
    updatePostChannelDto: UpdatePostGroupDto,
    req,
  ) {
    const findUser = await this.userModel.findOne({ _is: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findPost = await this.postChannelModel.findOne({ _id: postId });

    if (!findPost) {
      throw new NotFoundError('Post not found!');
    }

    if (findPost.adminId !== findUser.id) {
      throw new Error('You dont have an access!');
    }

    if (updatePostChannelDto?.name) {
      const update = await this.postChannelModel.findOneAndUpdate(
        { _id: findPost.id },
        { name: updatePostChannelDto.name },
        { upsert: true, new: true },
      );

      return {
        message: 'The name is succsessful updated!',
        post: update,
      };
    }

    if (updatePostChannelDto?.text) {
      const update = await this.postChannelModel.findOneAndUpdate(
        { _id: findPost.id },
        { text: updatePostChannelDto.text },
        { upsert: true, new: true },
      );

      return {
        message: 'The text is succsessful updated!',
        post: update,
      };
    }

    if (updatePostChannelDto?.text && updatePostChannelDto?.name) {
      const update = await this.postChannelModel.findOneAndUpdate(
        { _id: findPost.id },
        { name: updatePostChannelDto.name, text: updatePostChannelDto.text },
        { upsert: true, new: true },
      );

      return {
        message: 'The text and name is succsessful updated!',
        post: update,
      };
    }
  }

  async deletePost(postId: string, req) {
    const findUser = await this.postChannelModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findPost = await this.postChannelModel.findOne({ _id: postId });

    if (!findPost) {
      throw new NotFoundError('Post not found!');
    }

    if (findPost.adminId !== findUser.id) {
      return 'You dont have access!';
    }

    const deletePost = await this.postChannelModel.findOneAndDelete({
      _id: findPost.id,
    });

    return {
      message: 'Succsess!',
      post: deletePost,
    };
  }
}
