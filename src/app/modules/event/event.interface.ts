import { Types } from 'mongoose';

export interface IEvent {
  thumbnail: string;
  title: string;
  description: string;
  location: string;
  status: string;
  date: Date;
  createdBy: Types.ObjectId;
}
