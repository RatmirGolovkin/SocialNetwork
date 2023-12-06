import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PostChannel {
  @Prop()
  channelId: string;

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

export const postChannelSchema = SchemaFactory.createForClass(PostChannel);
