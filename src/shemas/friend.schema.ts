import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Friend {
  @Prop()
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  friends: [
    {
      userId: string;
      userName: string;
    },
  ];
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
