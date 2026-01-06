import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import User from '../user/user.model';
import { IContent } from './content.interface';
import Content from './content.model';

const createContent = async (
  userId: string,
  payload: IContent,
  file?: Express.Multer.File,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  if (file) {
    const thembleImage = await fileUploader.uploadToCloudinary(file);
    payload.thumbnail = thembleImage.url;
  }
  const result = await Content.create({ ...payload, createdBy: user._id });
  return result;
};

const getAllContent = async (params: any, options: IOption) => {
  const { limit, page, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: any[] = [];
  const userSearchableFields = [
    'category',
    'contentType',
    'title',
    'description',
    'body',
    'media.type',
  ];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
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
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Content.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit);
  const total = await Content.countDocuments(whereCondition);
  return { data: result, meta: { page, limit, total } };
};

const singleContent = async (id: string) => {
  const result = await Content.findById(id);
  if (!result) throw new AppError(404, 'Content not found');
  return result;
};

const updateContent = async (
  userId: string,
  id: string,
  payload: Partial<IContent>,
  file?: Express.Multer.File,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const content = await Content.findById(id);
  if (!content) throw new AppError(404, 'Content not found');
  if (user.role !== 'admin') {
    if (user._id.toString() !== content.createdBy.toString())
      throw new AppError(403, 'You are not authorized to update this content');
  }
  if (file) {
    const thembleImage = await fileUploader.uploadToCloudinary(file);
    payload.thumbnail = thembleImage.url;
  }
  const result = await Content.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteContent = async (userId: string, id: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const content = await Content.findById(id);
  if (!content) throw new AppError(404, 'Content not found');
  if (user.role !== 'admin') {
    if (user._id.toString() !== content.createdBy.toString())
      throw new AppError(403, 'You are not authorized to delete this content');
  }
  const result = await Content.findByIdAndDelete(id);
  if (!result) throw new AppError(404, 'Content not found');
  return result;
};

export const contentService = {
  createContent,
  getAllContent,
  singleContent,
  updateContent,
  deleteContent,
};
