import IncidentReport from '../models/incidentReport.model.js';
import errorHandler from '../utils/error.js';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../routes/incidentReport.route.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Comment from '../models/comment.model.js';

export const create = async (req, res, next) => {
  req.files.buffer;

  const awsBucketName = process.env.AWS_BUCKET_NAME;

  for (const file of req.files) {
    const params = {
      Bucket: awsBucketName,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);
  }
  try {
    const requiredFields = [
      'title',
      'incidentType',
      'incidentDate',
      'description',
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return next(errorHandler(400, `Please provide ${field}`));
      }
    }
    const slug = generateSlug(req.body.title);
    const files = [];
    const incidentReportData = {
      ...req.body,
      slug,
      userId: req.user.id,
      files: files,
    };

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        files.push({
          filename: file.originalname,
          contentType: file.mimetype,
          data: file.buffer,
          fileUrl: '',
        });
      });
    }

    const newIncidentReport = new IncidentReport(incidentReportData);
    const savedIncidentReport = await newIncidentReport.save();

    res.status(201).json(savedIncidentReport);
  } catch (error) {
    next(error);
  }
};

const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .split(' ')
      .join('-')
      .replace(/[^a-z0-9-]/g, '') +
    '-' +
    Math.random().toString(9).slice(-4)
  );
};

export const getIncidentReports = async (req, res, next) => {
  const awsBucketName = process.env.AWS_BUCKET_NAME;
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const searchTermQuery = req.query.searchTerm
      ? {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { description: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }
      : {};

    const incidentReports = await IncidentReport.find({
      ...searchTermQuery,
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.incidentType && { incidentType: req.query.incidentType }),
      ...(req.query.incidentReportId && { _id: req.query.incidentReportId }),
      ...(req.query.description && { description: req.query.description }),
      ...(req.query.incidentDate && { incidentDate: req.query.incidentDate }),
    })
      .populate('files')
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    for (const incidentReport of incidentReports) {
      const fileUrls = [];
      for (const file of incidentReport.files) {
        const getObjectParams = {
          Bucket: awsBucketName,
          Key: file.filename,
        };
        const command = new GetObjectCommand(getObjectParams);
        try {
          const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
          fileUrls.push(url);
        } catch (error) {
          next(error);
        }
      }
      incidentReport.files.forEach((file, index) => {
        file.fileUrl = fileUrls[index];
      });
    }

    const allIncidentReports = await IncidentReport.find({
      ...searchTermQuery,
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.incidentType && { incidentType: req.query.incidentType }),
      ...(req.query.incidentReportId && { _id: req.query.incidentReportId }),
      ...(req.query.description && { description: req.query.description }),
      ...(req.query.incidentDate && { incidentDate: req.query.incidentDate }),
    })
      .populate('files')
      .sort({ updatedAt: sortDirection });

    const totalIncidentReports = await IncidentReport.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );

    const lastMonthIncidentReports = await IncidentReport.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      incidentReports,
      allIncidentReports,
      totalIncidentReports,
      lastMonthIncidentReports,
    });
  } catch (error) {
    next(error);
  }
};

export const updateIncidentReportColumn = async (req, res, next) => {
  try {
    const updatedIncidentReportColumn = await IncidentReport.findByIdAndUpdate(
      req.params.cardId,
      {
        $set: {
          column: req.body.newColumn,
        },
      },
      { new: true },
    );
    res.status(200).json(updatedIncidentReportColumn);
  } catch (error) {
    next(error);
  }
};

export const getIncidentReportComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      incidentReportId: req.params.incidentReportId,
    }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
