import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { BannerController } from './banner.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.post(
  '/',
  auth(userRole.admin),
  fileUploader.upload.single('image'),
  BannerController.createBanner,
);
router.get('/', BannerController.getAllBanners);
router.get('/:id', BannerController.getBanner);
router.put(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.single('image'),
  BannerController.updateBanner,
);
router.delete('/:id', auth(userRole.admin), BannerController.deleteBanner);

export const bannerRouter = router;
