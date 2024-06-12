import mongoose from 'mongoose';

const incidentReportSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    loggedDate: {
      type: String,
      default: '',
    },
    loggedBy: {
      type: String,
      default: '',
    },
    files: [
      {
        filename: String,
        contentType: String,
        data: Buffer,
        fileUrl: [],
      },
    ],
    incidentType: {
      type: String,
      default: 'Trespassers',
    },
    incidentDate: {
      type: Date,
    },
    description: {
      type: String,
      required: true,
    },
    column: {
      type: String,
      default: 'Incident Report Created',
    },
    id: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const IncidentReport = mongoose.model('IncidentReport', incidentReportSchema);

export default IncidentReport;
