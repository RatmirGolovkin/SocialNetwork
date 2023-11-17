import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Channel {
  @Prop()
  name: string;

  @Prop()
  adminId: string;

  @Prop()
  description: string;

  @Prop()
  image: [{ imageType: string }, { imageId: string }, { imageUrl: string }];
}

export const channelSchema = SchemaFactory.createForClass(Channel);
