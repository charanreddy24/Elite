import mongoose from 'mongoose';

const parkingRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    column: {
      type: String,
      default: 'Active Permits',
    },
    id: {
      type: String,
      default: '',
    },
    issuedOn: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
    },
    parkingDayCount: {
      type: Number,
      required: true,
    },
    validUntil: {
      type: String,
      required: true,
    },
    vehicleColor: {
      type: String,
      required: true,
    },
    vehicleMake: {
      type: String,
      required: true,
    },
    visitingUnitNumber: {
      type: Number,
      required: true,
    },
    visitorName: {
      type: String,
      required: true,
    },
    additionalDetails: {
      type: String,
    },
  },
  { timestamps: true },
);

const ParkingRegistration = mongoose.model(
  'ParkingRegistration',
  parkingRegistrationSchema,
);

export default ParkingRegistration;
