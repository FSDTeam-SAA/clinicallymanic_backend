import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import User from '../user/user.model';
import { IShop } from './shop.interface';
import Shop from './shop.model';

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
  const result = await Shop.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(404, 'Shop not found');
  return result;
};

const deleteShop = async (id: string) => {
  const result = await Shop.findByIdAndDelete(id);
  if (!result) throw new AppError(404, 'Shop not found');
  return result;
};

export const shopService = {
  createShop,
  getAllShops,
  singleShop,
  updateShop,
  deleteShop,
};
