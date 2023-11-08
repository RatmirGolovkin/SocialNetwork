import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Image {
  @Prop()
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  imageType: string;

  @Prop()
  imageUrl: string;

  @Prop()
  filePath: string;

  @Prop()
  image: [
    {
      name: string;
      url: string;
      mimetype: string;
      img: Buffer;
    },
  ];
}

export const imageSchema = SchemaFactory.createForClass(Image);
