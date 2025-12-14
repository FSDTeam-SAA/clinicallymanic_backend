import mongoose from 'mongoose';
import { IBanner } from './banner.interface';

const bannerSchema = new mongoose.Schema<IBanner>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Banner = mongoose.model<IBanner>('Banner', bannerSchema);
export default Banner;
