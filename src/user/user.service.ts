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
import { Sub } from 'src/sub/schema/sub.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Post.name)
    private readonly postModule: Model<Post>,
    @InjectModel(Sub.name)
    private readonly subModel: Model<Sub>,
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

  // Get Posts //
  async getPosts(req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'This user is not found';
    }
  }

  // Register //
  async register(registerDto: RegisterDto) {
    const existedUser = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (existedUser) {
      return `This email ${existedUser.email}, alredy in use!`;
    }

    const hash = bcrypt.hashSync(registerDto.password, 10);
    registerDto.password = hash;

    const createUser = await this.userModel.create(registerDto);

    const sub = {
      userName: createUser.name,
      userId: createUser.id,
      subscription: [],
      subscriber: [],
    };

    await this.subModel.create(sub);

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
