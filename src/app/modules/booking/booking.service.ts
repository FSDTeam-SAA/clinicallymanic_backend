import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import Booking from './booking.model';

const getAllBooking = async (userId: string, params: any, options: IOption) => {
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
    andCondition.push({ userId: user._id });
  }

  const query = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Booking.find(query)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit)
    .populate('userId', '-password')
    .populate('shopId');

  const total = await Booking.countDocuments(query);

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getBookingById = async (id: string) => {
  const booking = await Booking.findById(id)
    .populate('userId', '-password')
    .populate('shopId');
  if (!booking) throw new AppError(404, 'Booking not found');

  return booking;
};

const updateStatus = async (id: string, status: string) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new AppError(404, 'Booking not found');
  if (booking.status === 'delivered')
    throw new AppError(400, 'Booking already delivered');
  const result = await Booking.findByIdAndUpdate(id, { status }, { new: true });

  return result;
};

export const bookingService = {
  getAllBooking,
  getBookingById,
  updateStatus,
};
