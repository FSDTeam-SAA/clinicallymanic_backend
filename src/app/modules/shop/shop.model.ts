import mongoose from 'mongoose';
import { IShop } from './shop.interface';

const shopSchema = new mongoose.Schema<IShop>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    size: { type: [String], required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },

    details: { type: String },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    totalShopUsers: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ],
    categories: {
      type: [String],
      enum: ['mens', 'womens', 'childrens', 'accessories', 'other'],
      required: true,
    },
  },
  { timestamps: true },
);

const Shop = mongoose.model<IShop>('Shop', shopSchema);

export default Shop;
