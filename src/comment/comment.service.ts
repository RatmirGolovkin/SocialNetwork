import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../shemas/comment.schema';
import { User } from 'src/shemas/user.schema';
import { Post } from 'src/shemas/post.schema';
import { CreateCommentDto } from 'src/dto/comment-dto/comment.dto';
import { UpdateCommentDto } from 'src/dto/comment-dto/update-comment';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Post.name)
    private readonly postModule: Model<Post>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  // Get comment
  async getComment(commentId: string) {
    const findComment = await this.commentModel.findOne({ _id: commentId });

    if (!findComment) {
      return 'Comment not found!';
    }

    return findComment;
  }

  // Create comment
  async createComment(postId: string, createCommentDto: CreateCommentDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found!';
    }

    const findPost = await this.postModule.findOne({ _id: postId });

    if (!findPost) {
      return 'Post not found!';
    }

    const createComment = {
      userName: findUser.name,
      userId: findUser.id,
      text: createCommentDto.text,
      postId: findPost.id,
    };

    const saveComment = await this.commentModel.create(createComment);

    return {
      message: 'Succsess!',
      comment: saveComment,
      post: findPost,
    };
  }

  // Edit comment (update text)
  async editComment(
    commentId: string,
    req,
    updateCommentDto: UpdateCommentDto,
  ) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found';
    }

    const findComment = await this.commentModel.findOne({ _id: commentId });

    if (!findComment) {
      return 'Error: Comment not found!';
    }

    if (findComment.text === updateCommentDto.text) {
      return 'Unupdate: You havent made any edits!';
    }

    if (findComment.userId !== findComment.userId) {
      return 'Error: you have no rights!';
    }

    const updateText = await this.commentModel.findOneAndUpdate(
      { _id: commentId },
      { text: updateCommentDto.text },
      { new: true, upsert: true },
    );

    return {
      message: `The comment succsessesful update!`,
      postId: updateText.postId,
      userName: updateText.userName,
      updateComment: updateText.text,
    };
  }

  // Delete comment //
  async deleteComment(id: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found';
    }

    const findComment = await this.commentModel.findOne({ _id: id });

    if (!findComment) {
      return 'Comment not found';
    }

    const findPost = await this.postModule.findOne({ _id: findComment.postId });

    if (!findPost) {
      return 'Post not found!';
    }

    const deleteComment = await this.commentModel.findByIdAndDelete({
      _id: findComment.id,
    });

    return {
      message: 'Succsess!',
      deletedComment: deleteComment,
    };
  }
}
