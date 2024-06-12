import mongoose from 'mongoose';

const shiftDetailsSchema = new mongoose.Schema(
  {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    equipment: {
      type: String,
      required: true,
    },
    relieved: {
      type: String,
      required: true,
    },
    toBeRelievedBy: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    uniform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Uniform',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    shiftActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const ShiftDetails = mongoose.model('ShiftDetails', shiftDetailsSchema);

export default ShiftDetails;
