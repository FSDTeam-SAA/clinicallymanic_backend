import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { EventService } from './event.service';

const createEvent = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User authentication required');
  }
  const result = await EventService.createEvent(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Event created successfully',
    data: result,
  });
});
const getAllEvents = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'title',
    'description',
    'location',
    'status',
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await EventService.getAllEvents(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Events retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new Error('Event ID is required');
  }
  const result = await EventService.singleEvent(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Event retrieved successfully',
    data: result,
  });
});
const updateEvent = catchAsync(async (req, res) => {
  const result = await EventService.updateEvent(req.params.id!, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Event updated successfully',
    data: result,
  });
});

const deleteEvent = catchAsync(async (req, res) => {
  const result = await EventService.deleteEvent(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Event deleted successfully',
    data: result,
  });
});

export const EventController = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
