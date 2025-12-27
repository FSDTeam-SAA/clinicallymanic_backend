import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { SubscriptionService } from './subscription.service';

const createSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.createSubscription(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription created successfully',
    data: result,
  });
});

const getAllSubscriptions = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'name',
    'type',
    'status',
    'features',
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await SubscriptionService.getAllSubscriptions(
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscriptions retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getSingleSubscription(
    req.params.id!,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription retrieved successfully',
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.updateSubscription(
    req.params.id!,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription updated successfully',
    data: result,
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.deleteSubscription(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription deleted successfully',
    data: result,
  });
});

const paySubscription = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await SubscriptionService.paySubscription(
    userId,
    req.params.subscriptionId!,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription paid successfully',
    data: result,
  });
});

export const SubscriptionController = {
  createSubscription,
  getAllSubscriptions,
  getSingleSubscription,
  updateSubscription,
  deleteSubscription,
  paySubscription,
};
