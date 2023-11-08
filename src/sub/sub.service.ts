import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/shemas/post.schema';
import { Subscriber } from 'src/shemas/subscriber.schema';
import { Subscription } from 'src/shemas/subscription.schema';
import { User } from 'src/shemas/user.schema';

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

  // Get all //
  async getAll(req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found!';
    }

    const findSubsrcibers = await this.subscriberModel.findOne({
      userId: findUser.id,
    });

    if (!findSubsrcibers) {
      return 'Error: Something happened with "Subscriber schema"!';
    }

    const findSubscription = await this.subscriptionModel.findOne({
      userId: findUser.id,
    });

    if (!findSubscription) {
      return 'Error: Something happened with "Subscription schema"!';
    }

    const subscription = findSubscription.subscription;

    const subscribers = findSubsrcibers.subscribers;

    const subscribersValue = subscribers.length;

    const subscriptionsValue = subscription.length;

    return {
      user: findUser.name,
      subscribersValue: subscribersValue,
      subscriptionsValue: subscriptionsValue,
      subscribers: subscribers,
      subscription: subscription,
    };
  }

  // Post subscribe //
  async subscribe(id: string, req) {
    if (id === req.user.id) {
      return 'You cant subscribe on this user!';
    }

    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found';
    }

    const findSubsUser = await this.userModel.findOne({ _id: id });

    if (!findSubsUser) {
      return 'This user is not exist!';
    }

    const findSubscriptionSchema = await this.subscriptionModel.findOne({
      userId: findUser.id,
    });

    if (!findSubscriptionSchema) {
      return 'Error: Something happened with "Subscription schema"!';
    }

    const subscriptionsArr = findSubscriptionSchema.subscription;

    const findExistSubs = subscriptionsArr.find(
      (subscriptionsArr) => subscriptionsArr.userId === findSubsUser.id,
    );

    if (findExistSubs) {
      return 'Already subscribe!';
    }

    const updatedSubscriptionData = {
      userName: findSubsUser.name,
      userId: findSubsUser.id,
    };

    await this.subscriptionModel.findOneAndUpdate(
      { userId: findUser.id },
      { subscription: updatedSubscriptionData },
      { new: true, upsert: true },
    );

    const findSubscriberSchema = await this.subscriberModel.findOne({
      userId: findSubsUser.id,
    });

    const subscriberArr = findSubscriberSchema.subscribers;

    const findExistSubscriber = subscriberArr.find(
      (subscriberArr) => subscriberArr.userId === findUser.id,
    );

    if (findExistSubscriber) {
      return 'Already subscribe!';
    }

    const updatedSubscriberData = {
      userName: findUser.name,
      userId: findUser.id,
    };

    subscriberArr.push(updatedSubscriberData);

    await this.subscriberModel.findOneAndUpdate(
      { userId: findSubsUser.id },
      {
        subscribers: subscriberArr,
        subscriberValue: subscriberArr.length,
      },
      { new: true, upsert: true },
    );

    return { message: 'Succsses!' };
  }

  // Unsubscribe //
  async unsubscribe(id: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      return 'User not found!';
    }

    const findUnsubUser = await this.userModel.findOne({ _id: id });

    if (!findUnsubUser) {
      return 'This unsubscribed user is not found!';
    }

    const findSubscriptionSchema = await this.subscriptionModel.findOne({
      userId: findUser.id,
    });

    if (!findSubscriptionSchema) {
      return 'Error: Something happened with "Subscription schema"!';
    }

    const subscriptionArr = findSubscriptionSchema.subscription;

    const findUnsabSubscription = subscriptionArr.findIndex(
      (subscriptionArr) => subscriptionArr.userId === findUnsubUser.id,
    );

    const findSubscriberSchema = await this.subscriberModel.findOne({
      userId: findUnsubUser.id,
    });

    if (!findSubscriberSchema) {
      return 'Error: Something happened with "Subscriber schema"!';
    }

    const subscriberArr = findSubscriberSchema.subscribers;

    const findUnsabSubscriber = subscriberArr.findIndex(
      (subscriberArr) => subscriberArr.userId === findUser.id,
    );

    if (findUnsabSubscriber && findUnsabSubscription < 0) {
      return 'Error: you are not subscribed';
    }

    // Deleted subscription //
    subscriptionArr.splice(findUnsabSubscription, 1);

    // Delete subscriber //
    subscriberArr.splice(findUnsabSubscriber, 1);

    await this.subscriptionModel.findOneAndUpdate(
      { userId: findUser.id },
      { subscription: subscriptionArr },
      { upsert: true, new: true },
    );

    await this.subscriberModel.findOneAndUpdate(
      { userId: findUnsubUser.id },
      { subscribers: subscriberArr, subscriberValue: subscriberArr.length },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess!',
    };
  }
}
