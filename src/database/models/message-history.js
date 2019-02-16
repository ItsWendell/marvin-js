import mongoose, { Schema } from 'mongoose';

export const schema = Schema({
  channelId: String,
  subtype: String,
  userId: String,
  text: String,
  timeString: String
});

export default mongoose.model('MessageHistory', schema);
