import mongoose,  { Schema, mongo } from 'mongoose';

export const schema = Schema({
    name: String,
    command: {
        type: String,
        unique: true,
        index: true,
        dropDups: true,
        required: true
    },
    response: String,
});

export default mongoose.model('Factoid', schema);