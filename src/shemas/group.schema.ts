import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Group {
  @Prop()
  name: string;

  @Prop()
  adminId: string;

  @Prop()
  description: string;

  @Prop()
  image: [{ imageId: string; imageUrl: string }];
}

export const groupSchema = SchemaFactory.createForClass(Group);
