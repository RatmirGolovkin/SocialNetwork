import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PostGroup {
  @Prop()
  groupId: string;

  @Prop()
  adminId: string;

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

export const postGroupSchema = SchemaFactory.createForClass(PostGroup);
