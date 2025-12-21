import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { contentService } from './content.service';

const createContent = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await contentService.createContent(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Content created successfully',
    data: result,
  });
});

const getAllContent = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'category',
    'contentType',
    'title',
    'description',
    'body',
    'media.type',
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await contentService.getAllContent(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Content retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const singleContent = catchAsync(async (req, res) => {
  const result = await contentService.singleContent(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Content retrieved successfully',
    data: result,
  });
});

const updateContent = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await contentService.updateContent(
    userId,
    req.params.id!,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Content updated successfully',
    data: result,
  });
});

const deleteContent = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await contentService.deleteContent(userId, req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Content deleted successfully',
    data: result,
  });
});

export const contentController = {
  createContent,
  getAllContent,
  singleContent,
  updateContent,
  deleteContent,
};
