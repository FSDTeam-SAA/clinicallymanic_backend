import { Types } from 'mongoose';

export interface IBanner {
  title: string;
  description: string;
  image: string;
  type: string;
  status?: 'active' | 'inactive';
  createdBy?: Types.ObjectId;
}
