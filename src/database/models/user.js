import mongoose, { Schema } from 'mongoose';

export const schema = new Schema({
  email: String,
  displayName: String,
  fortytwo: Object,
  admin: Boolean
});

export default mongoose.model('User', schema);
