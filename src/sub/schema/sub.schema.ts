import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Sub {
  @Prop()
  userName: string;

  @Prop()
  userId: string;

  @Prop()
  subscription: [string];

  @Prop()
  subscriber: [string];
}

export const subSchema = SchemaFactory.createForClass(Sub);
