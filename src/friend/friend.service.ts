import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { Channel } from 'src/shemas/channel.schema';
import { FriendRequest } from 'src/shemas/friend-request.schema';
import { Friend } from 'src/shemas/friend.schema';
import { Group } from 'src/shemas/group.schema';
import { Post } from 'src/shemas/post.schema';
import { User } from 'src/shemas/user.schema';

@Injectable()
export class FriendService {
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
  ) {}

  async getMyFriends(req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findFriends = await this.friendModel.findOne({ userId: findUser.id });

    if (!findFriends) {
      throw new Error('Error: friend schema not found!');
    }

    return findFriends.friends;
  }

  async getUserFriends(id: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findFriends = await this.friendModel.findOne({ userId: id });

    if (!findFriends) {
      throw new NotFoundError('User friends not found!');
    }

    if (findFriends.friends.length < 1) {
      return 'User not have friends!';
    }

    return findFriends.friends;
  }

  async sendFriendReq(receiverId: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const friendReq = await this.friendRequestModel.create({
      sander: findUser.id,
      receiver: receiverId,
    });

    const updateStatus = await this.friendRequestModel.findOneAndUpdate(
      { _id: friendReq.id },
      { status: 'pending' },
      { upsert: true, new: true },
    );

    return {
      message: 'Application sent!',
      receiver: updateStatus.receiver,
      status: updateStatus.status,
    };
  }

  async acceptFriendRequest(requestId: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findRequest = await this.friendRequestModel.findOne({
      _id: requestId,
    });

    if (!findRequest) {
      throw new NotFoundError('Request not found!');
    }

    if (findRequest.status === 'accepted') {
      throw new Error('This request alredy accepted!');
    }

    if (findRequest.receiver === findUser.id) {
      throw new Error('Error: You cant accepted!');
    }

    const findReceiver = await this.userModel.findOne({
      _id: findRequest.receiver,
    });

    const updateReqFriend = await this.friendRequestModel.findOneAndUpdate(
      { _id: requestId },
      { status: 'accepted' },
      { upsert: true, new: true },
    );

    const sanderSchema = await this.friendModel.findOne({
      userId: findUser.id,
    });

    const sanderArr = sanderSchema.friends;

    const sanderObj = {
      userId: updateReqFriend.sander,
      userName: findUser.name,
    };

    sanderArr.push(sanderObj);

    const receiverSchema = await this.friendModel.findOne({
      userId: findReceiver.id,
    });

    const receiverArr = receiverSchema.friends;

    const receiverObj = {
      userId: findReceiver.id,
      userName: findReceiver.name,
    };

    receiverArr.push(receiverObj);

    await this.friendModel.findOneAndUpdate(
      { _id: sanderSchema.id },
      { friends: receiverArr },
      { upsert: true, new: true },
    );

    await this.friendModel.findOneAndUpdate(
      { _id: receiverSchema.id },
      { friends: sanderArr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsesful accepted!',
      sander: findUser.id,
      status: 'accepted',
    };
  }

  async declineFriendRequest(requestId: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findRequest = await this.friendRequestModel.findOne({
      _id: requestId,
    });

    if (!findRequest) {
      throw new NotFoundError('Request not found!');
    }

    if (findRequest.status === 'accepted') {
      throw new Error(
        'This user already beed in your friend list. Try delete this user!',
      );
    }

    if (findRequest.receiver === findUser.id) {
      throw new Error('Error: You cant declined this request!');
    }

    const update = await this.friendRequestModel.findOneAndRemove({
      _id: requestId,
    });

    return {
      message: 'Succsessful declined!',
      sander: update.sander,
      status: update.status,
    };
  }

  async deleteFriend(friendId: string, req) {
    if (friendId === req.user.id) {
      throw new Error('Error');
    }

    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findDeletedUser = await this.userModel.findOne({ _id: friendId });

    if (!findDeletedUser) {
      throw new NotFoundError('Deleted user not found!');
    }

    const findUserFriend = await this.friendModel.findOne({
      userId: findUser.id,
    });

    const findDeletedUserSchema = await this.friendModel.findOne({
      userId: findDeletedUser.id,
    });

    if (!findUserFriend) {
      throw new Error('Schemas "Finded user" not found!');
    }

    if (!findDeletedUserSchema) {
      throw new Error('Schemas "Deleted user" not found!');
    }

    const userFriendArr = findUserFriend.friends;

    userFriendArr.splice(
      userFriendArr.indexOf({
        userId: findDeletedUser.id,
        userName: findDeletedUser.name,
      }),
    );

    await this.friendModel.findOneAndUpdate(
      { userId: findUser.id },
      { friends: userFriendArr },
      { upsert: true, new: true },
    );

    const deletedArr = findDeletedUserSchema.friends;

    deletedArr.splice(
      deletedArr.indexOf({
        userId: findUser.id,
        userName: findUser.name,
      }),
    );

    await this.friendModel.findOneAndUpdate(
      { userId: findDeletedUser.id },
      { friends: deletedArr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess!',
    };
  }
}
