import { Types } from 'mongoose';

export interface INews {
  title: string;
  description: string;
  image: string;
  type: string;
  author?: Types.ObjectId;
}
