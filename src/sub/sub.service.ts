import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/post/schema/post.schema';
import { User } from 'src/user/schema/user.schema';
import { Subscription } from './schema/subscription.schema';
import { Subscriber } from './schema/subscriber.schema';

@Injectable()
export class SubService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: Model<Subscriber>,
  ) {}

  // Get subscriptions //
  async getAllSubscriptions(req) {
    const findSubscriptions = await this.subscriptionModel.findOne({
      userId: req.user.id,
    });

    if (!findSubscriptions) {
      return 'User not found!';
    }

    const subscriptoins = findSubscriptions.subscription;

    if (subscriptoins.length <= 0) {
      return '0';
    }

    return {
      subscriptions: subscriptoins,
      subscriptionsValue: subscriptoins.length,
    };
  }

  // Get subscribers //
  async getAllSubscribers(req) {
    const findSubscribers = await this.subscriberModel.findOne({
      userId: req.user.id,
    });

    if (!findSubscribers) {
      return 'User not found!';
    }

    if (findSubscribers.subscriberValue === 0) {
      return '0';
    }

    return {
      subscribers: findSubscribers.subscribers,
      subscribersValue: findSubscribers.subscriberValue,
    };
  }

  // Subscribe //
  async subscribe(id: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found!';
    }

    const findSubUser = await this.userModel.findOne({ _id: id });

    if (!findSubUser) {
      return 'Sub user not found!';
    }

    // Subscription

    const findSchema = await this.subscriptionModel.findOne({
      userId: findUser.id,
    });

    const subscriptionArr = findSchema.subscription;

    if (subscriptionArr.length > 0) {
      for ({ userId: id } of subscriptionArr) {
        return 'You already subscribe to this user!';
      }
    }

    const subscription = {
      userName: findSubUser.name,
      userId: id,
    };

    subscriptionArr.push(subscription);

    const updateSubscriptionSchema =
      await this.subscriptionModel.findOneAndUpdate(
        { userId: findUser.id },
        { subscription: subscriptionArr },
        { new: true, upsert: true },
      );
    //

    // Subscriber //
    const findSubscriberSchema = await this.subscriberModel.findOne({
      userId: id,
    });

    const subscriberArr = findSubscriberSchema.subscribers;

    const subsciber = {
      userName: findUser.name,
      userId: findUser.id,
    };

    subscriberArr.push(subsciber);

    const updateSubscriberSchema = await this.subscriberModel.findOneAndUpdate(
      { userId: id },
      { subscribers: subscriberArr, subscriberValue: subscriberArr.length },
      { new: true, upsert: true },
    );
    //

    return {
      message: 'Subscribe!',
      subscription: updateSubscriptionSchema,
      subscriber: updateSubscriberSchema,
    };
  }

  // Unsubscribe
  async unsubscribe(id: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found';
    }

    const findSubscriberSchema = await this.subscriberModel.findOne({
      userId: findUser.id,
    });

    const subsciberArr = findSubscriberSchema.subscribers;

    if (subsciberArr.length <= 0) {
      return 'Error: not found subscribe';
    }
    // deleted user in subscription and subscribers
  }
}
