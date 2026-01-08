import mongoose from 'mongoose';
import { IOffer } from './offers.interface';

const offerSchema = new mongoose.Schema<IOffer>(
  {
    thumbnail: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true },
);

const Offer = mongoose.model<IOffer>('Offer', offerSchema);

export default Offer;
