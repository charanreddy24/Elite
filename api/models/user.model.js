import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    conversations: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
  },
  { timestamps: true },
);

const User = mongoose.model('user', userSchema);

export default User;
