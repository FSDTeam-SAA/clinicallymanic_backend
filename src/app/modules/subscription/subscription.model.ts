import mongoose from 'mongoose';
import { ISubscription } from './subscription.interface';

const subscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['monthly', 'yearly'] },
    price: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'] },
    features: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalSubscribedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

const Subscription = mongoose.model<ISubscription>(
  'Subscription',
  subscriptionSchema,
);

export default Subscription;