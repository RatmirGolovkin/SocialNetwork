import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dto/post-dto/create-post.dto';
import { User } from 'src/shemas/user.schema';
import { Post } from 'src/shemas/post.schema';
import { UpdatePostDto } from 'src/dto/post-dto/update-post.dto';
import { FindPostDto } from 'src/dto/post-dto/find-post.dto';

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

  // Get one Post (name) //
  async getPost(findPostDto: FindPostDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found!';
    }

    const findPost = await this.postModel.findOne({ name: findPostDto.name });

    if (!findPost) {
      return 'Post is not found!';
    }

    if (findPost.userId !== findUser.id) {
      return 'No access!';
    }

    return findPost;
  }

  // Create post //
  async createPost(createPost: CreatePostDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found!';
    }

    const findExistPost = await this.postModel.findOne({ userId: findUser.id });

    if (findExistPost.name === createPost.name) {
      return 'This post name already in use!';
    }

    const createCard = await this.postModel.create({
      userId: findUser.id,
      userName: findUser.name,
      name: createPost.name,
      text: createPost.text,
    });

    return {
      message: 'Succsess!',
      card: {
        userName: createCard.userName,
        userId: createCard.userId,
        postName: createCard.name,
        text: createCard.text,
      },
    };
  }

  // Update post //
  async updatePost(id: string, updatePost: UpdatePostDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found!';
    }

    const findPost = await this.postModel.findOne({ _id: id });

    if (!findPost) {
      return 'Post not found!';
    }

    if (findPost.userId !== findUser.id) {
      return 'No access!';
    }

    if (findPost.name === updatePost?.name) {
      return 'Make some changes!';
    }

    if (findPost.text === updatePost?.text) {
      return 'Make some changes';
    }

    if (updatePost?.name) {
      const updateName = await this.postModel.findOneAndUpdate(
        { _id: findPost.id },
        { name: updatePost.name },
        { upsert: true, new: true },
      );

      return {
        message: 'Name succsessful update!',
        post: updateName,
      };
    }

    if (updatePost?.text) {
      const updateText = await this.postModel.findOneAndUpdate(
        { _id: findPost.id },
        { text: updatePost.text },
        { upsert: true, new: true },
      );

      return {
        message: 'Text succsessful update!',
        post: updateText,
      };
    }

    return 'Error';
  }

  // Delete post //
  async deletePost(postName: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found';
    }

    const findPost = await this.postModel.findOne({
      userId: findUser.id,
      name: postName,
    });

    if (!findPost) {
      return 'Post not found!';
    }
  }
}
