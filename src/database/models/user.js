import mongoose, { Schema } from 'mongoose';

export const schema = new Schema(
  {
    email: String,
    displayName: String,
    intra42: Object,
    slack: Object,
    admin: Boolean
  },
  {
    toJSON: {
      transform(doc, ret) {}
    }
  }
);

schema.methods.slackClient = function slackClient(cb) {
  console.log('SLACK USER', this.slack);
  if (this.slack && this.slack.accessToken) {
    cb();
  }
  console.log(this.slack);
};

export default mongoose.model('User', schema);
