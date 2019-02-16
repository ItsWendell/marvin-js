import mongoose, { Schema } from 'mongoose';

export const FactoidTypes = Object.freeze({
  Javascript: 'javascript',
  Alias: 'alias',
  Text: 'text'
});

export const schema = Schema({
  name: String,
  type: {
    type: String,
    enum: Object.values(FactoidTypes),
    default: 'text'
  },
  command: {
    type: String,
    unique: true,
    index: true,
    dropDups: true,
    required: true
  },
  response: {
    type: String,
    required: true,
    default: 'No response available.'
  }
});

export default mongoose.model('Factoid', schema);
