import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  image: [{ imageId: string; imageUrl: string }];
}

export const userSchema = SchemaFactory.createForClass(User);
