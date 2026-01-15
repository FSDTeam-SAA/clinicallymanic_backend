import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { shopController } from './shop.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.post(
  '/',
  auth(userRole.admin),
  fileUploader.upload.array('images'),
  shopController.createShop,
);

router.post('/pay/:id', auth(userRole.user), shopController.payShop);
router.get('/', shopController.getAllShops);
router.get('/:id', shopController.singleShop);
router.put(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.array('images'),
  shopController.updateShop,
);
router.delete('/:id', auth(userRole.admin), shopController.deleteShop);

export const shopRouter = router;
