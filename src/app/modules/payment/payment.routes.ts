import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { paymentController } from './payment.controller';
const router = express.Router();

router.get(
  '/',
  auth(userRole.admin, userRole.user),
  paymentController.paymentByUser,
);

export const paymentRoutes = router;
