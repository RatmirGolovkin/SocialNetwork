import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Схема подписки
@Schema()
export class Sub {
  @Prop()
  userName: string;

  @Prop()
  userId: string;

  @Prop()
  subscription: [{ userName: string; userId: string }];
}

export const subsSchema = SchemaFactory.createForClass(Sub);
