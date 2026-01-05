import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { paymentService } from './payment.service';

const paymentByUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const filters = pick(req.query, ['searchTerm', 'paymentType', 'status']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await paymentService.paymentByUser(userId, filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const paymentController = { paymentByUser };
