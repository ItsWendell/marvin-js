import mongoose, { Schema } from 'mongoose';

export const FactoidTypes = Object.freeze({
  Javascript: 'javascript',
  Alias: 'alias',
  Text: 'text'
});

export const schema = Schema(
  {
    coalitionId: Number,
    name: String,
    slug: String,
    score: Number
  },
  {
    timestamps: true
  }
);

export default mongoose.model('CoalitionHistory', schema);
