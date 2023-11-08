import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Comment {
  @Prop()
  userName: string;

  @Prop()
  userId: string;

  @Prop()
  postId: string;

  @Prop()
  text: string;

  @Prop()
  images: [
    {
      imageId: string;
      imageUrl: string;
    },
  ];
}

export const commentSchema = SchemaFactory.createForClass(Comment);
