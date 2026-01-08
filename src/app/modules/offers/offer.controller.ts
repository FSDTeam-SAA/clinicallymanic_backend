import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { offerService } from './offers.service';

const createOffers = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await offerService.createOffers(fromData, file);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Offer created successfully',
    data: result,
  });
});

const getAllOffers = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'title',
    'description',
    'status',
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await offerService.getAllOffers(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offers retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getOfferById = catchAsync(async (req, res) => {
  const result = await offerService.getOfferById(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offer retrieved successfully',
    data: result,
  });
});

const updateOfferById = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await offerService.updateOfferById(
    req.params.id!,
    fromData,
    file,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offer updated successfully',
    data: result,
  });
});

const deleteOfferById = catchAsync(async (req, res) => {
  const result = await offerService.deleteOfferById(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offer deleted successfully',
    data: result,
  });
});

export const offerController = {
  createOffers,
  getAllOffers,
  getOfferById,
  updateOfferById,
  deleteOfferById,
};
