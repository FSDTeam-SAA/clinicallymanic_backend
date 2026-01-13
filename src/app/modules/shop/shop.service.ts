import Stripe from 'stripe';
import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import User from '../user/user.model';
import { IShop } from './shop.interface';
import Shop from './shop.model';
import Payment from '../payment/payment.model';
import config from '../../config';
import Booking from '../booking/booking.model';
import { IBooking } from '../booking/booking.interface';

const stripe = new Stripe(config.stripe.secretKey!);

const createShop = async (
  userId: string,
  payload: IShop,
  files?: Express.Multer.File[],
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(400, 'User not found');
  if (files && files.length > 0) {
    const shopFile = await Promise.all(
      files.map(async (file) => {
        const result = await fileUploader.uploadToCloudinary(file);
        return result.url;
      }),
    );
    payload.images = shopFile;
  }

  if (typeof payload.size === 'string') {
    payload.size = JSON.parse(payload.size);
  }

  if (typeof payload.categories === 'string') {
    payload.size = JSON.parse(payload.categories);
  }

  const result = await Shop.create({ ...payload, createdBy: user._id });
  if (!result) throw new AppError(400, 'Failed to create shop');
  return result;
};

const getAllShops = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: any[] = [];
  const userSearchableFields = [
    'name',
    'title',
    'description',
    'size',
    'type',
    'status',
    'details',
    'categories',
  ];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Shop.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  if (!result) {
    throw new AppError(404, 'Users not found');
  }

  const total = await Shop.countDocuments(whereCondition);

  if (!result) throw new AppError(400, 'Failed to get shops');
  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const singleShop = async (id: string) => {
  const result = await Shop.findById(id);
  if (!result) throw new AppError(404, 'Shop not found');
  return result;
};

const updateShop = async (
  id: string,
  payload: Partial<IShop>,
  files?: Express.Multer.File[],
) => {
  if (files) {
    const shopFile = await Promise.all(
      files.map(async (file) => {
        const result = await fileUploader.uploadToCloudinary(file);
        return result.url;
      }),
    );
    payload.images = shopFile;
  }
  if (typeof payload.size === 'string') {
    payload.categories = JSON.parse(payload.size);
  }

  if (typeof payload.categories === 'string') {
    payload.categories = JSON.parse(payload.categories);
  }

  const result = await Shop.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(404, 'Shop not found');
  return result;
};

const deleteShop = async (id: string) => {
  const result = await Shop.findByIdAndDelete(id);
  if (!result) throw new AppError(404, 'Shop not found');
  return result;
};

const payShop = async (
  userId: string,
  shopId: string,
  payload: Partial<IBooking>,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const shop = await Shop.findById(shopId);
  if (!shop) throw new AppError(404, 'Shop not found');

  if (!user.isSubscription) {
    if (shop.type === 'Exclusive') {
      throw new AppError(
        400,
        'Please subscribe to our service to access this feature',
      );
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: shop.price ? shop.price * 100 : 0,
          product_data: {
            name: shop.name,
            description: shop.description,
          },
        },
        quantity: 1,
      },
    ],
    customer_email: user.email,
    success_url: `${config.frontendUrl}/payment-success`,
    cancel_url: `${config.frontendUrl}/payment-cancel`,
    metadata: {
      userId: user._id.toString(),
      productId: shop._id.toString(),
      paymentType: 'shop',
      type: shop.type,
      amount: shop.price.toString(),
    },
  } as any);

  if (!shop.size?.includes(payload.size!)) {
    throw new AppError(400, 'Invalid size');
  }

  const booking = await Booking.create({
    userId: user._id,
    shopId: shop._id,
    price: shop.price,
    productName: shop.name,
    status: 'pending',
    ...payload,
  });

  const payment = await Payment.create({
    user: user._id,
    shop: shop._id,
    stripeSessionId: session.id,
    amount: shop.price || 0,
    currency: 'usd',
    paymentType: 'shop',
    status: 'pending',
    subscription: user.subscription ?? null,
    booking: booking._id,
  });
  booking.paymentId = payment._id;
  await booking.save();

  return { url: session.url, sessionId: session.id };
};

export const shopService = {
  createShop,
  getAllShops,
  singleShop,
  updateShop,
  deleteShop,
  payShop,
};
