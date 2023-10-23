import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/user-dto/user-register.dto';
import { User } from './schema/user.schema';
import { UpdatePasswordDto } from '../dto/user-dto/update-password.dto';
import { UpdateDto } from '../dto/user-dto/update-user.dto';
import { LoginDto } from '../dto/user-dto/user-login.dto';
import { Post } from 'src/post/schema/post.schema';
import { Subscription } from 'src/sub/schema/subscription.schema';
import { UserPosts } from './schema/user-posts.schema';
import { Subscriber } from 'src/sub/schema/subscriber.schema';
import { UpdateEmailDto } from 'src/dto/user-dto/update-email.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Post.name)
    private readonly postModule: Model<Post>,
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(UserPosts.name)
    private readonly userPostsModel: Model<UserPosts>,
    @InjectModel(Subscriber.name)
    private readonly subsriberModel: Model<Subscriber>,
    private jwtService: JwtService,
  ) {}

  // Get One User //
  async getOne(req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return `User is not found!`;
    }

    const request = {
      name: findUser.name,
      login: findUser.login,
      email: findUser.email,
    };

    return request;
  }

  // Get user posts //
  async getUserPosts(req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User does not found!';
    }

    const findPost = await this.userPostsModel.findOne({ userId: findUser.id });

    if (findPost.postsValue === 0) {
      return 'This user dont have posts';
    }

    return {
      userName: findUser.name,
      login: findUser.login,
      postsValue: findPost.postsValue,
      posts: findPost.posts,
    };
  }

  // Register //
  async register(registerDto: RegisterDto) {
    const existedUserEmail = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (existedUserEmail) {
      return `This email ${existedUserEmail.email}, alredy in use!`;
    }

    const existedUserLogin = await this.userModel.findOne({
      login: registerDto.login,
    });

    if (existedUserLogin) {
      return `This login ${existedUserLogin.login}, alrady in use!`;
    }

    const hash = bcrypt.hashSync(registerDto.password, 10);
    registerDto.password = hash;

    const createUser = await this.userModel.create(registerDto);

    const userPosts = {
      userName: registerDto.name,
      userId: createUser.id,
      postsValue: 0,
      posts: [],
    };

    await this.userPostsModel.create(userPosts);

    const sub = {
      userName: createUser.name,
      userId: createUser.id,
      subscription: [],
    };

    await this.subscriptionModel.create(sub);

    const subscribers = {
      userName: registerDto.name,
      userId: createUser.id,
      subscribers: [],
      subscriberValue: 0,
    };

    await this.subsriberModel.create(subscribers);

    const response = {
      name: createUser.name,
      email: createUser.email,
    };

    return response;
  }

  // Login //
  async login(loginDto: LoginDto) {
    const existedUser = await this.userModel.findOne({
      login: loginDto.login,
    });

    if (!existedUser) {
      return `This user: ${existedUser.login}, does not exist!`;
    }

    const comparePassword = bcrypt.compare(
      loginDto.password,
      existedUser.password,
    );

    if (!comparePassword) {
      return `Incorrect password`;
    }

    const payload = { id: existedUser.id };

    const access_token = await this.jwtService.signAsync(payload);

    const response = {
      message: `User: '${existedUser.login}', successfully authorized!`,
      email: existedUser.email,
      access_token: access_token,
    };

    return response;
  }

  // Change password //
  async updateUserPassword(updatePassword: UpdatePasswordDto) {
    if (updatePassword.newPassword === updatePassword.oldPassword) {
      return 'Change new password!';
    }

    const existedUser = await this.userModel.findOne({
      email: updatePassword.email,
    });

    if (!existedUser) {
      return `This user does not exist!`;
    }

    const compareNewPassword = await bcrypt.compare(
      updatePassword.newPassword,
      existedUser.password,
    );

    if (compareNewPassword) {
      return 'This password already in use!';
    }

    const comparePassword = await bcrypt.compare(
      updatePassword.oldPassword,
      existedUser.password,
    );

    if (!comparePassword) {
      return 'Incorrect password!';
    }

    const hashNewPassword = await bcrypt.hashSync(
      updatePassword.newPassword,
      10,
    );

    const update = await this.userModel.findOneAndUpdate(
      { password: existedUser.password },
      { password: hashNewPassword },
      { new: true, upsert: true },
    );

    const response = {
      message: `The password for '${update.login}', successfully updated!`,
      name: update.name,
      email: update.email,
      password: hashNewPassword,
    };

    return response;
  }

  // Change Email //
  async updateUserEmail(updateEmailDto: UpdateEmailDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found!';
    }

    if (findUser.email === updateEmailDto.newEmail) {
      return 'Error.Email';
    }

    const findExistedEmail = await this.userModel.findOne({
      email: updateEmailDto.newEmail,
    });

    if (findExistedEmail) {
      return 'This email already in use!';
    }

    const updateEmail = await this.userModel.findByIdAndUpdate(
      { _id: findUser.id },
      { email: updateEmailDto.newEmail },
      { new: true, upsert: true },
    );

    const response = {
      message: `The user: '${updateEmail.login}', successfully updated!`,
      name: updateEmail.name,
      login: updateEmail.login,
      email: updateEmail.email,
    };

    return response;
  }

  // Update User //
  async updateUser(updateDto: UpdateDto, req) {
    const existedUser = await this.userModel.findOne({ _id: req.user.id });

    if (!existedUser) {
      return `This user is not found!`;
    }

    const updateUser = await this.userModel.findByIdAndUpdate(
      existedUser.id,
      updateDto,
      {
        new: true,
        upsert: true,
      },
    );

    console.log(updateUser);

    const response = {
      message: `The user: '${updateUser.login}', successfully updated!`,
      name: updateUser.name,
      login: updateUser.login,
      email: updateUser.email,
    };

    return response;
  }

  // Delete User //
  async deleteUserByIdToken(req) {
    const existedUser = await this.userModel.findOne({ _id: req.user.id });

    if (!existedUser) {
      return `This user is not found!`;
    }

    await this.userModel.findByIdAndRemove({
      _id: req.user.id,
    });

    return `The user: '${existedUser.login}', successfully authorized!`;
  }
}
