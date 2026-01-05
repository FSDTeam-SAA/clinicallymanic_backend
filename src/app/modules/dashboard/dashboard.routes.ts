import express from 'express';
import { dashboardController } from './dashboard.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

router.get(
  '/revenue-overview',
  auth(userRole.admin),
  dashboardController.getRevenueOverview,
);
router.get('/', auth(userRole.admin), dashboardController.dashboardOverview);
router.get(
  '/user-growth',
  auth(userRole.admin),
  dashboardController.getUserGrowth,
);

export const dashboardRoutes = router;
