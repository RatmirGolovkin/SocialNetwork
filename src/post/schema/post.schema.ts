import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Post {
  @Prop()
  name: string;

  @Prop()
  userId: string;

  @Prop()
  text: string;
}

export const postSchema = SchemaFactory.createForClass(Post);
