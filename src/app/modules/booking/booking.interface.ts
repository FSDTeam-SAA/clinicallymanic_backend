import { Types } from 'mongoose';

export interface IBooking {
  shopId?: Types.ObjectId;
  userId?: Types.ObjectId;
  paymentId?: Types.ObjectId;
  productName?: string;
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  price?: number;
  bookingDate?: Date;
  status?: 'pending' | 'shipping' | 'delivered' | 'cancelled';
  notes?: string;
  size?: string;
}
