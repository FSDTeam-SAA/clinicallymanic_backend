import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { bookingService } from './booking.service';

const getAllBooking = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const filters = pick(req.query, ['searchTerm']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await bookingService.getAllBooking(userId, filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All booking fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getBookingById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.getBookingById(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single booking fetched successfully',
    data: result,
  });
});

const updateStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await bookingService.updateStatus(id!, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking updated successfully',
    data: result,
  });
});

const deleteBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.deleteBooking(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking deleted successfully',
    data: result,
  });
});

export const bookingController = {
  getAllBooking,
  getBookingById,
  updateStatus,
  deleteBooking,
};
