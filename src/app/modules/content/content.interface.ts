import { Types } from 'mongoose';

export interface IContent {
  category: string;
  contentType: string;

  title: string;
  description?: string;
  thumbnail?: string;
  body?: string;

  media?: {
    type: string;
    data: any;
  }[];

  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
