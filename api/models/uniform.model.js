import mongoose from 'mongoose';

const uniformSchema = new mongoose.Schema(
  {
    whiteShirt: {
      type: Boolean,
      required: true,
    },
    blackTie: {
      type: Boolean,
      default: false,
    },
    badgeID: {
      type: Boolean,
      default: false,
    },
    blackPants: {
      type: Boolean,
      default: false,
    },
    securityLogoBlazer: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Uniform = mongoose.model('Uniform', uniformSchema);

export default Uniform;
