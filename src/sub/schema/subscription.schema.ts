import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Схема подписки
@Schema()
export class Subscription {
  @Prop()
  userName: string;

  @Prop()
  userId: string;

  @Prop()
  subscription: [{ userName: string; userId: string }];
}

export const subscriptionSchema = SchemaFactory.createForClass(Subscription);
