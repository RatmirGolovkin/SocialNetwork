import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserPosts {
  @Prop()
  userName: string;

  @Prop()
  userId: string;

  @Prop()
  postsValue: number;

  @Prop()
  posts: [string];
}

export const userPostsSchema = SchemaFactory.createForClass(UserPosts);
