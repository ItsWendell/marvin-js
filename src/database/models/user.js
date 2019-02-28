import mongoose, { Schema } from 'mongoose';

export const schema = new Schema(
  {
    email: String,
    displayName: String,
    intra42: Object,
    admin: Boolean
  },
  {
    toJSON: {
      transform(doc, ret) {}
    }
  }
);

export default mongoose.model('User', schema);
