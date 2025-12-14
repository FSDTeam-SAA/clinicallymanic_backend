import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { BannerService } from './banner.service';

const createBanner = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const file = req.file;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await BannerService.createBanner(userId, fromData, file);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Banner created successfully',
    data: result,
  });
});

const getAllBanners = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'title',
    'description',
    'type',
    'status',
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await BannerService.getAllBanners(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banners retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getBanner = catchAsync(async (req, res) => {
  const result = await BannerService.getBanner(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banner retrieved successfully',
    data: result,
  });
});

const updateBanner = catchAsync(async (req, res) => {
  const file = req.file;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await BannerService.updateBanner(
    req.params.id!,
    fromData,
    file,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banner updated successfully',
    data: result,
  });
});

const deleteBanner = catchAsync(async (req, res) => {
  const result = await BannerService.deleteBanner(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banner deleted successfully',
    data: result,
  });
});

export const BannerController = {
  createBanner,
  getAllBanners,
  getBanner,
  updateBanner,
  deleteBanner,
};
