import { Types } from 'mongoose';

export interface IPayment {
  user?: Types.ObjectId;
  subscription?: Types.ObjectId;
  shop?: Types.ObjectId;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentType: 'subscription' | 'shop';
  createdAt?: Date;
  updatedAt?: Date;
  stripePaymentIntentId?: string;
  booking?: Types.ObjectId;
}
