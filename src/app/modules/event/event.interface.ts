import { Types } from 'mongoose';

export interface IEvent {
  title: string;
  description: string;
  location: string;
  status: string;
  date: Date;
  createdBy: Types.ObjectId;
}
