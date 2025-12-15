import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { dashboardService } from './dashboard.service';

const dashboardOverview = catchAsync(async (req, res) => {
  const result = await dashboardService.dashboardOverview();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard overview data retrieved successfully',
    data: result,
  });
});

export const dashboardController = {
  dashboardOverview,
};
