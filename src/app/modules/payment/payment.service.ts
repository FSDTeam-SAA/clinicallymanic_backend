import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import Payment from './payment.model';

const paymentByUser = async (userId: string, params: any, options: IOption) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const { limit, page, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const searchableFields = ['paymentType', 'status'];

  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  if (user.role !== userRole.admin) {
    andCondition.push({ user: user._id });
  }

  const query = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Payment.find(query)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit)
    .populate('user')
    .populate('shop')
    .populate('subscription');

  const total = await Payment.countDocuments(query);

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const paymentService = {
  paymentByUser,
};
