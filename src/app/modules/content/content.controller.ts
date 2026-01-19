import AppError from '../../error/appError';
import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { contentService } from './content.service';

const createContent = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  const formData = req.body.data ? JSON.parse(req.body.data) : req.body;

  if (formData.media && typeof formData.media === 'string') {
    try {
      formData.media = JSON.parse(formData.media);
    } catch (err) {
      console.log(err);
      throw new AppError(400, 'Invalid media JSON format');
    }
  }

  if (formData.media && !Array.isArray(formData.media)) {
    formData.media = [formData.media];
  }

  const file = req.file as Express.Multer.File;

  const result = await contentService.createContent(userId, formData, file);
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
  const formData = req.body.data ? JSON.parse(req.body.data) : req.body;

  if (formData.media && typeof formData.media === 'string') {
    try {
      formData.media = JSON.parse(formData.media);
    } catch (err) {
      console.log(err);
      throw new AppError(400, 'Invalid media JSON format');
    }
  }

  if (formData.media && !Array.isArray(formData.media)) {
    formData.media = [formData.media];
  }

  const file = req.file as Express.Multer.File;
  const result = await contentService.updateContent(
    userId,
    req.params.id!,
    formData,
    file,
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
