import mongoose from 'mongoose';
import { IEvent } from './event.interface';

const eventSchema = new mongoose.Schema<IEvent>(
  {
    thumbnail: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
