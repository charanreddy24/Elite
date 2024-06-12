import mongoose from 'mongoose';

const unitFileSchema = new mongoose.Schema(
  {
    unitNumber: {
      type: String,
      required: true,
      unique: true,
    },
    residents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
        default: [],
      },
    ],
    licensePlate: {
      type: String,
    },
    spotDetails: {
      type: String,
    },
  },
  { timestamps: true },
);

unitFileSchema.index({ unitNumber: 1 }, { unique: true });

const UnitFile = mongoose.model('UnitFile', unitFileSchema);

UnitFile.on('index', (error) => {
  if (error) {
    console.error('Index creation failed:', error);
  } else {
    console.log('Indexes created successfully');
  }
});

UnitFile.ensureIndexes();

export default UnitFile;
