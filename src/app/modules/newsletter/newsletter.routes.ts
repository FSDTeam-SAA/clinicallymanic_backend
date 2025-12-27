import express from 'express';
import { newsletterController } from './newsletter.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

router.post(
  '/broadcast',
  auth(userRole.admin),
  newsletterController.broadcastNewsletter,
);
router.post('/', newsletterController.createNewsletter);
router.get('/', auth(userRole.admin), newsletterController.getAllNewsletters);

router.get(
  '/:id',
  auth(userRole.admin),
  newsletterController.getSingleNewsletter,
);
router.put('/:id', auth(userRole.admin), newsletterController.updateNewsletter);
router.delete(
  '/:id',
  auth(userRole.admin),
  newsletterController.deleteNewsletter,
);

export const newsletterRoutes = router;
