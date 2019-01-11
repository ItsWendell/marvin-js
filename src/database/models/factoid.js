import mongoose,  { Schema, mongo } from 'mongoose';

export const schema = Schema({
    name: String,
    command: String,
    response: String,
});

export default mongoose.model('Factoid', schema);