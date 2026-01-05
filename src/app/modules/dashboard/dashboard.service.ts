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

const getRevenueOverviewService = async (year?: number) => {
  const selectedYear = year || new Date().getFullYear();

  const startDate = new Date(`${selectedYear}-01-01`);
  const endDate = new Date(`${selectedYear}-12-31`);

  const result = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalRevenue: { $sum: '$amount' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Empty month handle
  return months.map((month, index) => {
    const found = result.find((r) => r._id === index + 1);
    return {
      month,
      revenue: found ? found.totalRevenue : 0,
    };
  });
};

const getUserGrowthOverviewService = async (year?: number) => {
  const selectedYear = year || new Date().getFullYear();

  const startDate = new Date(`${selectedYear}-01-01`);
  const endDate = new Date(`${selectedYear}-12-31`);

  const result = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        users: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Empty month handle (same as revenue)
  return months.map((month, index) => {
    const found = result.find((r) => r._id === index + 1);
    return {
      month,
      users: found ? found.users : 0,
    };
  });
};

export const dashboardService = {
  dashboardOverview,
  getRevenueOverviewService,
  getUserGrowthOverviewService,
};
