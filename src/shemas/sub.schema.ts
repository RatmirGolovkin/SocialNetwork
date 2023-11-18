import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Sub {
  @Prop()
  userName: string;

  @Prop()
  userId: string;

  @Prop()
  subChannel: [{ name: string; channelId: string }];

  @Prop()
  subGroup: [{ name: string; groupId: string }];
}

export const subsSchema = SchemaFactory.createForClass(Sub);
