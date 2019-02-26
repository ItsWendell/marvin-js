import mongoose, { Schema } from 'mongoose';

export const Schema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: String,
  displayName: String,
  fortytwo: Object,
  admin: Boolean
});

export default mongoose.model('User', schema);
