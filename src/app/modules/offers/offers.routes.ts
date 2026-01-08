import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { offerController } from './offer.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.post('/', auth(userRole.admin),fileUploader.upload.single('thumbnail'), offerController.createOffers);
router.get('/', offerController.getAllOffers);
router.get('/:id', offerController.getOfferById);
router.put('/:id', auth(userRole.admin),fileUploader.upload.single('thumbnail'), offerController.updateOfferById);
router.delete('/:id', auth(userRole.admin), offerController.deleteOfferById);

export const offerRoutes = router;
