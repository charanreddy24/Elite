import express from 'express';
import {
  create,
  getParkingPermits,
} from '../controllers/parkingRegister.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getParkingPermits', getParkingPermits);
export default router;
