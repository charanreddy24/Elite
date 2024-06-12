import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  create,
  getIncidentReports,
  updateIncidentReportColumn,
} from '../controllers/incidentReport.controller.js';
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const awsBucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

export const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: awsBucketRegion,
});

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create', upload.array('files', 50), verifyToken, create);
router.get('/getIncidentReports', getIncidentReports);
router.put('/updateIncidentReportColumn/:cardId', updateIncidentReportColumn);

export default router;
