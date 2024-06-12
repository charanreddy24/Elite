import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  getImportantContacts,
  getPostOrders,
  importantContacts,
  postOrders,
} from '../controllers/infoPages.controller.js';

const router = express.Router();

router.put('/importantContacts', verifyToken, importantContacts);
router.get('/getImportantContacts', verifyToken, getImportantContacts);
router.put('/postOrders', verifyToken, postOrders);
router.get('/getPostOrders', verifyToken, getPostOrders);

export default router;
