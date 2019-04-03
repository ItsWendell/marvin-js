import mongoose, { Schema } from 'mongoose';
import { WebClient } from '@slack/client';

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

schema.methods.slackClient = function slackClient() {
  const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } = process.env;
  if (this.slack && this.slack.accessToken) {
    return new WebClient(this.slack.accessToken, {
      clientId: SLACK_CLIENT_ID,
      clientSecret: SLACK_CLIENT_SECRET
    });
  }
  return null;
};

export default mongoose.model('User', schema);
