import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { contentController } from './content.controller';
const router = express.Router();

router.post(
  '/',
  auth(userRole.admin, userRole.user),
  contentController.createContent,
);

export const contentRouter = router;
