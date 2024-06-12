import mongoose from 'mongoose';

const contactsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
  },
  { timestamps: true },
);

const postOrdersSchema = new mongoose.Schema({
  content: {
    type: String,
  },
});

const PostOrders = mongoose.model('PostOrders', postOrdersSchema);
const ImportantContacts = mongoose.model('ImportantContacts', contactsSchema);

export { ImportantContacts, PostOrders };
