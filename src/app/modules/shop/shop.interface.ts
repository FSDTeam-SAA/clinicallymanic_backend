import { Types } from 'mongoose';

export type ShopCategory =
  | 'mens'
  | 'womens'
  | 'childrens'
  | 'accessories'
  | 'other';

export interface IShop {
  name: string;
  title?: string;
  description?: string;
  images?: string[];
  size?: string[];
  price: number;
  type?: string;
  status?: 'active' | 'inactive';
  details?: string;
  createdBy?: Types.ObjectId;
  totalShopUsers?: Types.ObjectId[];

  categories?: ShopCategory[];
}
