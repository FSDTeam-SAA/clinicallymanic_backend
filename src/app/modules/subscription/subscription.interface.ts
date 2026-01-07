import { Types } from 'mongoose';

export interface ISubscription {
  name: string;
  type: 'monthly' | 'yearly';
  price: number;
  status?: 'active' | 'inactive';
  features?: string[];
  createdBy?: Types.ObjectId;
  totalSubscribedUsers?: Types.ObjectId[];
}
