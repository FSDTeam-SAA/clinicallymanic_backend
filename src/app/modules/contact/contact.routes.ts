import express from 'express';
import { contactController } from './contact.controller';
const router = express.Router();

router.post('/', contactController.createContact);
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getSingleContact);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

export const contactRoutes = router;
