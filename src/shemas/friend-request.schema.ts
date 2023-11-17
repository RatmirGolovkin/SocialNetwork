import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class FriendRequest {
  @Prop()
  sander: string;

  @Prop()
  receiver: string;

  @Prop()
  status: string;
}

export const FriendRequestSchema = new mongoose.Schema(
  {
    sander: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true },
);
