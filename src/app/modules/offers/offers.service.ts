import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import { IOffer } from './offers.interface';
import Offer from './offers.model';

const createOffers = async (payload: IOffer, file?: Express.Multer.File) => {
  if (file) {
    const image = await fileUploader.uploadToCloudinary(file);
    payload.thumbnail = image.url;
  }
  const result = await Offer.create(payload);
  if (!result) throw new AppError(400, 'Failed to create offer');
  return result;
};

const getAllOffers = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = ['title', 'description', 'status'];

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

  const result = await Offer.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  if (!result) {
    throw new AppError(404, 'Offers not found');
  }

  const total = await Offer.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getOfferById = async (id: string) => {
  const result = await Offer.findById(id);
  if (!result) throw new AppError(404, 'Offer not found');
  return result;
};

const updateOfferById = async (
  id: string,
  payload: IOffer,
  file?: Express.Multer.File,
) => {
  if (file) {
    const image = await fileUploader.uploadToCloudinary(file);
    payload.thumbnail = image.url;
  }
  const result = await Offer.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(404, 'Offer not found');
  return result;
};

const deleteOfferById = async (id: string) => {
  const result = await Offer.findByIdAndDelete(id);
  if (!result) throw new AppError(404, 'Offer not found');
  return result;
};

export const offerService = {
  createOffers,
  getAllOffers,
  getOfferById,
  updateOfferById,
  deleteOfferById,
};
