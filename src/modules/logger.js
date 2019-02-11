import { rtm } from '../slack';
import { MessageHistory } from '../database/models';

export function activate() {
  rtm.on('message', ({ text, user, channel, subtype, ts }) => {
    const message = new MessageHistory({
      channelId: channel,
      userId: user,
      subtype,
      text,
      timeString: ts
    });

    message.save();

    // Log the message
    console.log(`[Logger] (channel:${channel}) ${user} says: ${text}`);
  });
}
