import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { EventController } from './event.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.post(
  '/',
  auth(userRole.admin),
  fileUploader.upload.single('thumbnail'),
  EventController.createEvent,
);
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getSingleEvent);
router.put(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.single('thumbnail'),
  EventController.updateEvent,
);
router.delete('/:id', auth(userRole.admin), EventController.deleteEvent);

export const eventRouter = router;
