import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Post {
  @Prop()
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  name: string;

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

export const postSchema = SchemaFactory.createForClass(Post);
