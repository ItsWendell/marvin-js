import { rtm, web } from './slack';
import MessageHistory from '../database/models/message-history';

export function listen() {
    rtm.on('message', ({ text, user, channel, subtype, ts }) => {
        const message = new MessageHistory({
            channelId: channel,
            userId: user,
            subtype,
            text,
            timeString: ts,
        });

        message.save();

          // Log the message
        console.log(`[Logger] (channel:${channel}) ${user} says: ${text}`);
    });
}

export function backFillChannel(channels = [] || '') {

}

export function backFillAllChannels() {
    web.channels.list().then((data) => {
        console.log('data', data);
    });
}

