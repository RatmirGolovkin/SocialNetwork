import { Schema } from '@nestjs/mongoose';

@Schema()
export class Lent {
  lent: [
    {
      userName: string;
      userId: string;
      userImage: string;
      postName: string;
      postId: string;
      postImage: string;
    },
  ];
}
