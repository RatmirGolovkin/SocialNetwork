import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto } from 'src/dto/group-dto/create-group.dto';
import { Post } from 'src/shemas/post.schema';
import { User } from 'src/shemas/user.schema';
import { Group } from 'src/shemas/group.schema';
import { UpdateDescriptionGroupDto } from 'src/dto/group-dto/update-des-group';
import { Sub } from 'src/shemas/sub.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Post.name)
    private readonly postModule: Model<Post>,
    @InjectModel(Sub.name)
    private readonly subscriptionModel: Model<Sub>,
    @InjectModel(Group.name)
    private readonly groupModel: Model<Group>,
  ) {}

  async getGroup(id: string, req) {
    const findGroup = await this.groupModel.findOne({ _id: id });

    if (!findGroup) {
      throw new Error('Group not found!');
    }

    return {
      group: findGroup,
      admin: req.user.id,
    };
  }

  async createGroup(createGroup: CreateGroupDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new Error('User not found!');
    }

    const findExistGroup = await this.groupModel.findOne({
      adminId: findUser.id,
    });

    if (findExistGroup?.name === createGroup.name) {
      throw new Error('You already have any group with this name!');
    }

    const newGroup = {
      name: createGroup.name,
      adminId: findUser.id,
      description: createGroup.description,
      image: [],
    };

    const save = await this.groupModel.create(newGroup);

    return {
      message: 'Succsessful saved!',
      group: save,
    };
  }

  async updateDescription(
    updateDescription: UpdateDescriptionGroupDto,
    req,
    id: string,
  ) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new Error('User not found!');
    }

    const findGroup = await this.groupModel.findOne({ _id: id });

    if (!findGroup) {
      throw new Error('Group not found!');
    }

    if (findGroup?.adminId !== findUser?.id) {
      throw new Error('Error');
    }

    const update = await this.groupModel.findOneAndUpdate(
      { _id: findGroup.id },
      { description: updateDescription.description },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess!',
      group: update,
    };
  }

  async delete(id: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new Error('User not found!');
    }

    const findGroup = await this.groupModel.findOne({ _id: id });

    if (!findGroup) {
      throw new Error('Group not found!');
    }

    if (findGroup.adminId !== findUser.id) {
      throw new Error('Error: dont have access!');
    }

    const deleteGroup = await this.groupModel.findOneAndDelete({
      _id: findGroup.id,
    });

    return {
      message: 'Succsess!',
      group: deleteGroup,
    };
  }
}
