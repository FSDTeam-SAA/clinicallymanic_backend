import Payment from '../payment/payment.model';
import User from '../user/user.model';

const dashboardOverview = async () => {
  const total = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
      },
    },
  ]);
  const totalRevenue = total[0]?.totalRevenue || 0;
  const totalUser = await User.countDocuments();
  const subscription = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paymentType: 'subscription',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
      },
    },
  ]);

  const subscriptionRevenue = subscription[0]?.totalRevenue || 0;
  const shop = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paymentType: 'shop',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
      },
    },
  ]);
  const shopRevenue = shop[0]?.totalRevenue || 0;

  return { totalRevenue, totalUser, subscriptionRevenue, shopRevenue };
};

export const dashboardService = {
  dashboardOverview,
};
