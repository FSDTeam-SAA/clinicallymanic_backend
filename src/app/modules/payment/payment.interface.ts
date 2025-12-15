import { Types } from 'mongoose';

export interface IPayment {
  user?: Types.ObjectId;
  subscription?: Types.ObjectId;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt?: Date;
  updatedAt?: Date;
  stripePaymentIntentId?: string;
}
