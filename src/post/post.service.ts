import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/post/schema/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dto/post-dto/create-post.dto';
import { User } from 'src/user/schema/user.schema';
import { UpdatePostDto } from 'src/dto/post-dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  // Get all //
  async getAllPosts(req) {
    return await this.postModel.find({ userId: req.user.id });
  }

  // Create post //
  async createPost(createPost: CreatePostDto, req) {
    const findUser = await this.userModel.findById({ _id: req.user.id });

    if (!findUser) {
      return 'User not found!';
    }

    const findPost = await this.postModel.findOne({ name: createPost.name });

    if (findPost) {
      return 'This name already in use';
    }

    return await this.postModel.create({
      name: createPost.name,
      userId: req.user.id,
      text: createPost.text,
    });
  }

  // Update post //
  async updatePost(updatePost: UpdatePostDto, req) {
    const findPost = await this.postModel.findOne({ userId: req.user.id });

    if (!findPost) {
      return 'Post does not found!';
    }

    if (findPost.text === updatePost.text) {
      return 'Change text!';
    }

    await this.postModel.findByIdAndUpdate(
      { _id: findPost.id },
      { text: updatePost.text },
      { new: true, upsert: true },
    );

    return `Text to: ${findPost.name}, updated!`;
  }

  // Delete post //
  async deletePost(postName: string, req) {
    const findPost = await this.postModel.findOne({ userId: req.user.id });

    if (!findPost) {
      return 'Posts is not found!';
    }

    await this.postModel.findOneAndDelete({ name: postName });

    return 'Deleted!';
  }
}
