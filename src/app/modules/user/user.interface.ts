import { Types } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'contractor';
  profileImage?: string;
  bio?: string;
  phone?: string;
  location?: string;
  otp?: string;
  otpExpiry?: Date;
  verified?: boolean;
  isSubscription?: boolean;
  subscription?: Types.ObjectId;
  subscriptionExpiry?: Date;
}
