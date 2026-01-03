import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { contentController } from './content.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.post(
  '/',
  auth(userRole.admin, userRole.user),
  fileUploader.upload.single('thumbnail'),
  contentController.createContent,
);

router.get('/', contentController.getAllContent);
router.get('/:id', contentController.singleContent);
router.put(
  '/:id',
  auth(userRole.admin, userRole.user),
  fileUploader.upload.single('thumbnail'),
  contentController.updateContent,
);
router.delete(
  '/:id',
  auth(userRole.admin, userRole.user),
  contentController.deleteContent,
);

export const contentRouter = router;
