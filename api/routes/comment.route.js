import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createComment } from '../controllers/comment.controller.js';
import { getIncidentReportComments } from '../controllers/incidentReport.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get(
  '/getIncidentReportComments/:incidentReportId',
  getIncidentReportComments,
);

export default router;
