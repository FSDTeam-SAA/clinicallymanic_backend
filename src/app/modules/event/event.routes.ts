import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { EventController } from './event.controller';
const router = express.Router();

router.post('/', auth(userRole.admin), EventController.createEvent);
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getSingleEvent);
router.put('/:id', auth(userRole.admin), EventController.updateEvent);
router.delete('/:id', auth(userRole.admin), EventController.deleteEvent);

export const eventRouter = router;
