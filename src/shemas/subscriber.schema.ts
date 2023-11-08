import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Схема подпиcчиков
@Schema()
export class Subscriber {
  @Prop()
  userName: string;

  @Prop()
  userId: string;

  @Prop()
  subscribers: [{ userName: string; userId: string }];

  @Prop()
  subscriberValue: number;
}

export const subscriberSchema = SchemaFactory.createForClass(Subscriber);
