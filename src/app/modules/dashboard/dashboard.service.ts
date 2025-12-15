import User from '../user/user.model';

const dashboardOverview = async () => {
  const totalRevenue = 0;
  const totalUser = await User.countDocuments();
  const onGoingMatch = 0;
  const pendingRegister = 0;

  return { totalRevenue, totalUser, onGoingMatch, pendingRegister };
};

export const dashboardService = {
  dashboardOverview,
};
