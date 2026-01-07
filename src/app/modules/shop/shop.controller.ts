import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { shopService } from './shop.service';

const createShop = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const files = req.files as Express.Multer.File[];
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await shopService.createShop(userId, fromData, files);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Shop created successfully',
    data: result,
  });
});

const getAllShops = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'name',
    'title',
    'description',
    'size',
    'type',
    'status',
    'details',
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await shopService.getAllShops(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shops retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const singleShop = catchAsync(async (req, res) => {
  const result = await shopService.singleShop(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shop retrieved successfully',
    data: result,
  });
});

const updateShop = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await shopService.updateShop(req.params.id!, fromData, files);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shop updated successfully',
    data: result,
  });
});

const deleteShop = catchAsync(async (req, res) => {
  const result = await shopService.deleteShop(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shop deleted successfully',
    data: result,
  });
});

const payShop = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await shopService.payShop(userId, req.params.id!, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shop paid successfully',
    data: result,
  });
});

export const shopController = {
  createShop,
  getAllShops,
  singleShop,
  updateShop,
  deleteShop,
  payShop,
};
