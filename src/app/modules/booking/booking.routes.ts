import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { bookingController } from './booking.controller';
const router = express.Router();

router.get(
  '/',
  auth(userRole.admin, userRole.user),
  bookingController.getAllBooking,
);
router.get('/:id', bookingController.getBookingById);
router.put('/:id', auth(userRole.admin), bookingController.updateStatus);

export const bookingRouter = router;
