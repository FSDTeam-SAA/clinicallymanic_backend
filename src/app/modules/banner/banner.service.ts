import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import User from '../user/user.model';
import { IBanner } from './banner.interface';
import Banner from './banner.model';

const createBanner = async (
  userId: string,
  payload: IBanner,
  file?: Express.Multer.File,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(400, 'User not found');
  if (file) {
    const bannerFile = await fileUploader.uploadToCloudinary(file);
    payload.image = bannerFile.url;
  }
  const result = await Banner.create({ ...payload, createdBy: user._id });
  if (!result) throw new AppError(400, 'Failed to create banner');
  return result;
};

const getAllBanners = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: any[] = [];
  const userSearchableFields = ['title', 'description', 'type', 'status'];

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

  const result = await Banner.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  if (!result) {
    throw new AppError(404, 'Users not found');
  }

  const total = await Banner.countDocuments(whereCondition);

  if (!result) throw new AppError(400, 'Failed to get banners');
  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};
const getBanner = async (id: string) => {
  const result = await Banner.findById(id);
  if (!result) throw new AppError(400, 'Failed to get banner');
  return result;
};
const updateBanner = async (
  id: string,
  payload: IBanner,
  file?: Express.Multer.File,
) => {
  const result = await Banner.findByIdAndUpdate(id, payload, { new: true });
  if (file) {
    const bannerFile = await fileUploader.uploadToCloudinary(file);
    payload.image = bannerFile.url;
  }
  if (!result) throw new AppError(400, 'Failed to update banner');
  return result;
};
const deleteBanner = async (id: string) => {
  const result = await Banner.findByIdAndDelete(id);
  if (!result) throw new AppError(400, 'Failed to delete banner');
  return result;
};
export const BannerService = {
  createBanner,
  getAllBanners,
  getBanner,
  updateBanner,
  deleteBanner,
};
