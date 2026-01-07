import mongoose from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    price: { type: Number, required: true },
    location: { type: String },
    bookingDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
