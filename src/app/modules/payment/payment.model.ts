import mongoose from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    stripeSessionId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
    },
    paymentType: {
      type: String,
      required: true,
      enum: ['subscription', 'shop'],
    },
    stripePaymentIntentId: { type: String },
  },
  { timestamps: true },
);

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
