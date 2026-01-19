import Stripe from 'stripe';
import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { ISubscription } from './subscription.interface';
import Subscription from './subscription.model';
import config from '../../config';
import User from '../user/user.model';
import Payment from '../payment/payment.model';

const stripe = new Stripe(config.stripe.secretKey!);

const createSubscription = async (payload: ISubscription) => {
  const name = await Subscription.findOne({ name: payload.name });
  if (name) throw new AppError(400, 'Subscription already exists');
  const result = await Subscription.create(payload);
  return result;
};

const getAllSubscriptions = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = [
    'firstName',
    'name',
    'type',
    'status',
    'features',
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

  const result = await Subscription.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  if (!result) {
    throw new AppError(404, 'Users not found');
  }

  const total = await Subscription.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleSubscription = async (id: string) => {
  const result = await Subscription.findById(id);
  if (!result) {
    throw new AppError(404, 'Subscription not found');
  }
  return result;
};

const updateSubscription = async (id: string, payload: ISubscription) => {
  const result = await Subscription.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(404, 'Subscription not found');
  }
  return result;
};

const deleteSubscription = async (id: string) => {
  const result = await Subscription.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Subscription not found');
  }
  return result;
};

const paySubscription = async (userId: string, subscriptionId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new AppError(404, 'Subscription not found');

  if (
    subscription.name === 'basic' &&
    subscription.totalSubscribedUsers?.includes(user._id)
  ) {
    throw new AppError(400, 'You have already subscribed to this plan');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: subscription.price * 100,
          product_data: {
            name: subscription.name,
            description: subscription.type,
          },
        },
        quantity: 1,
      },
    ],
    customer_email: user.email,
    success_url: `${config.frontendUrl}/plans-success`,
    cancel_url: `${config.frontendUrl}/plans-cancel`,
    metadata: {
      userId: user._id.toString(),
      subscriptionId: subscription._id.toString(),
      paymentType: 'subscription',
      type: subscription.type,
      amount: subscription.price.toString(),
    },
  });

  await Payment.create({
    user: user._id,
    subscription: subscription._id,
    stripeSessionId: session.id,
    amount: subscription.price,
    currency: 'usd',
    status: 'pending',
    paymentType: 'subscription',
  });

  return { url: session.url, sessionId: session.id };
};

export const SubscriptionService = {
  createSubscription,
  getAllSubscriptions,
  getSingleSubscription,
  updateSubscription,
  deleteSubscription,
  paySubscription,
};
