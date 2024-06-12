import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const shiftLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    logs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Log',
        default: [],
      },
    ],
    shiftDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShiftDetails',
      required: true,
    },
  },
  { timestamps: true },
);

const Log = mongoose.model('Log', logSchema);
const ShiftLog = mongoose.model('ShiftLog', shiftLogSchema);

export { Log, ShiftLog };
