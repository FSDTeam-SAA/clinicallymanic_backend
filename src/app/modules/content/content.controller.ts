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

export const contentController = {
  createContent,
};
