import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { newsletterService } from './newsletter.service';

const createNewsletter = catchAsync(async (req, res) => {
  const result = await newsletterService.createNewsletter(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Newsletter created successfully',
    data: result,
  });
});

const getAllNewsletters = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['searchTerm', 'email']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await newsletterService.getAllNewsletters(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Newsletters retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getSingleNewsletter = catchAsync(async (req, res) => {
  const result = await newsletterService.getSingleNewsletter(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Newsletter retrieved successfully',
    data: result,
  });
});

const updateNewsletter = catchAsync(async (req, res) => {
  const result = await newsletterService.updateNewsletter(
    req.params.id!,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Newsletter updated successfully',
    data: result,
  });
});

const deleteNewsletter = catchAsync(async (req, res) => {
  const result = await newsletterService.deleteNewsletter(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Newsletter deleted successfully',
    data: result,
  });
});

const broadcastNewsletter = catchAsync(async (req, res) => {
  const result = await newsletterService.broadcastNewsletter(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Newsletter broadcasted successfully',
    data: result,
  });
});

export const newsletterController = {
  createNewsletter,
  getAllNewsletters,
  getSingleNewsletter,
  updateNewsletter,
  deleteNewsletter,
  broadcastNewsletter,
};
