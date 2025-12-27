import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { SubscriptionController } from './subscription.controller';
const router = express.Router();

router.post(
  '/',
  auth(userRole.admin),
  SubscriptionController.createSubscription,
);

router.post(
  '/pay/:subscriptionId',
  auth(userRole.user),
  SubscriptionController.paySubscription,
);

router.get('/', SubscriptionController.getAllSubscriptions);

router.get('/:id', SubscriptionController.getSingleSubscription);

router.put(
  '/:id',
  auth(userRole.admin),
  SubscriptionController.updateSubscription,
);

router.delete(
  '/:id',
  auth(userRole.admin),
  SubscriptionController.deleteSubscription,
);

export const subscriptionRouter = router;
