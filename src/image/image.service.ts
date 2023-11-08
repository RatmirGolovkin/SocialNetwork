import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'src/shemas/comment.schema';
import { Image } from 'src/shemas/image.schema';
import { Post } from 'src/shemas/post.schema';
import { User } from 'src/shemas/user.schema';
import * as fs from 'fs';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    @InjectModel(Image.name)
    private readonly imgModel: Model<Image>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  // Get Image //
  async getFile(name: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found!';
    }

    const findImage = await this.imgModel.findOne({
      imageUrl: `http://localhost:3000/image/get/${name}`,
    });

    if (!findImage) {
      throw new Error('Image not found!');
    }

    const readFile = fs.readFile(findImage.filePath, 'utf-8', () => {});

    return readFile;
  }

  // Upload avatar image //
  async uploadAvatarImage(file: Express.Multer.File, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new Error('User not found!');
    }

    const findImage = await this.imgModel.find({
      $and: [{ userId: findUser.id }, { imageType: 'avatar' }],
    });

    if (findImage) {
      return this.updateAvatar(file, req);
    }

    fs.writeFile(
      `../social-network/social-network/file-directory/${file.originalname}`,
      file.buffer,
      () => {},
    );

    const imageUrl = `http://localhost:3000/image/get/${file.originalname}`;

    const savePayload = {
      userId: findUser.id,
      userName: findUser.name,
      imageType: 'avatar',
      imageUrl: imageUrl,
      filePath: `../social-network/social-network/file-directory/${file.originalname}`,
      image: [
        {
          name: file.originalname,
          url: imageUrl,
          mimetype: file.mimetype,
          img: file.buffer,
        },
      ],
    };

    const saveInDb = await this.imgModel.create(savePayload);

    return {
      message: 'Succsess!',
      img: saveInDb,
    };
  }

  // Upload post image
  async uploadPostImage(file: Express.Multer.File, req, postId: string) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new Error('User not found!');
    }

    const findComment = await this.commentModel.findOne({ _id: postId });

    if (findComment) {
      throw new Error('Check postId (Found in CommentDB)!');
    }

    const findPost = await this.postModel.findOne({ _id: postId });

    if (!findPost) {
      throw new Error('Post not found!');
    }

    fs.writeFile(
      `../social-network/social-network/file-directory/${file.originalname}`,
      file.buffer,
      () => {},
    );

    const imageUrl = `http://localhost:3000/image/get/${file.originalname}`;

    const savePayload = {
      userId: findUser.id,
      userName: findUser.name,
      imageType: 'post',
      imageUrl: imageUrl,
      filePath: `../social-network/social-network/file-directory/${file.originalname}`,
      image: [
        {
          name: file.originalname,
          url: imageUrl,
          mimetype: file.mimetype,
          img: file.buffer,
        },
      ],
    };

    const saveInDb = await this.imgModel.create(savePayload);

    const postImageArr = findPost.images;

    const arrPayload = {
      imageId: saveInDb.id,
      imageUrl: imageUrl,
    };

    postImageArr.push(arrPayload);

    await this.postModel.findOneAndUpdate(
      { _id: findPost.id },
      { images: postImageArr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess!',
      image: saveInDb.image,
    };
  }

  // Upload comment image
  async uploadCommentImage(file: Express.Multer.File, req, commentId: string) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new Error('User not found!');
    }

    const findComment = await this.commentModel.findOne({ _id: commentId });

    if (!findComment) {
      const findPost = await this.postModel.findOne({ _id: commentId });

      if (findPost) {
        throw new Error('Check commentId (Found in PostDB)!');
      }
    }

    fs.writeFile(
      `../social-network/social-network/file-directory/${file.originalname}`,
      file.buffer,
      () => {},
    );

    const imageUrl = `http://localhost:3000/image/get/${file.originalname}`;

    const savePayload = {
      userId: findUser.id,
      userName: findUser.name,
      imageType: 'comment',
      imageUrl: imageUrl,
      filePath: `../social-network/social-network/file-directory/${file.originalname}`,
      image: [
        {
          name: file.originalname,
          url: imageUrl,
          mimetype: file.mimetype,
          img: file.buffer,
        },
      ],
    };

    const saveInDb = await this.imgModel.create(savePayload);

    const commentImageArr = findComment.images;

    const arrPayload = {
      imageId: saveInDb.id,
      imageUrl: imageUrl,
    };

    commentImageArr.push(arrPayload);

    await this.commentModel.findOneAndUpdate(
      { _id: findComment.id },
      { images: commentImageArr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess!',
      image: saveInDb.image,
    };
  }

  // Update
  async updateAvatar(file: Express.Multer.File, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new Error('User not found!');
    }

    const findImage = await this.imgModel.findOne({
      $and: [{ userId: findUser.id }, { imageType: 'avatar' }],
    });

    if (!findImage) {
      throw new Error('Image not found!');
    }

    fs.unlink(findImage.filePath, () => {});

    fs.writeFile(
      `../social-network/social-network/file-directory/${file.originalname}`,
      file.buffer,
      () => {},
    );

    const newUrl = `http://localhost:3000/image/get/${file.originalname}`;

    const imageArr = [];

    const imagePayload = {
      name: file.originalname,
      url: newUrl,
      mimetype: file.mimetype,
      img: file.buffer,
    };

    imageArr.push(imagePayload);

    const updateDb = await this.imgModel.findOneAndUpdate(
      { _id: findImage.id },
      {
        imageUrl: newUrl,
        filePath: `../social-network/social-network/file-directory/${file.originalname}`,
        image: imageArr,
      },
      {
        upsert: true,
        new: true,
      },
    );

    return {
      message: 'Succsess!',
      updateDb: updateDb,
    };
  }

  // Delete
  async delete(id: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new Error('User not found!');
    }

    const findImage = await this.imgModel.findOne({ _id: id });

    if (!findImage) {
      throw new Error('Image not found!');
    }

    if (findImage.userId !== findUser.id) {
      throw new Error('Access error!');
    }

    if (findImage.imageType === 'avatar') {
      fs.unlink(findImage.filePath, () => {});

      await this.imgModel.findOneAndDelete({ _id: findImage.id });

      return 'Succsess!';
    }

    if (findImage.imageType === 'post') {
      fs.unlink(findImage.filePath, () => {});

      const findPost = await this.postModel.findOne({
        images: [{ imageId: findImage.id, imageUrl: findImage.imageUrl }],
      });

      if (!findPost) {
        throw new Error('Post not found! (if imageType === post)');
      }

      const updatedPayload = {
        userId: findPost.userId,
        userName: findPost.userName,
        name: findPost.name,
        text: findPost.text,
        images: [],
      };

      await this.postModel.findOneAndUpdate(
        { _id: findPost.id },
        { updatedPayload },
        { upsert: true, new: true },
      );

      return 'Succsess!';
    }

    if (findImage.imageType === 'comment') {
      fs.unlink(findImage.filePath, () => {});

      const findComment = await this.commentModel.findOne({
        images: [{ imageId: findImage.id, imageUrl: findImage.imageUrl }],
      });

      if (!findComment) {
        throw new Error('Post not found! (if imageType === comment)');
      }

      const updatedPayload = {
        userName: findComment.userName,
        userId: findComment.userId,
        postId: findComment.postId,
        text: findComment.text,
        images: [],
      };

      await this.commentModel.findOneAndUpdate(
        { _id: findComment.id },
        { updatedPayload },
        { upsert: true, new: true },
      );

      return 'Succsess!';
    }
  }
}
