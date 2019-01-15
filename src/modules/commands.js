import commands from '../providers/commands';
import { rtm } from '../slack';

import MessageHistory from '../database/models/message-history';

export function activate() {
    registerCommands();
    
    rtm.on('message', ({ text, user, channel, ...message }) => {
        // Skip messages that are from a bot or my own user ID, or are for factoids.
        if (!text || (message.subtype && message.subtype === 'bot_message') ||
            (!message.subtype && user === rtm.activeUserId) ||
            text.startsWith('!')) {
            return;
        }

        // Only listen to commands which are sent using @user and as a direct message.        
        if (channel.startsWith('D') || text.includes(`<@${rtm.activeUserId}>`)) {
            const command = text.replace(`<@${rtm.activeUserId}>`, '').trim();
            commands.parse(command, {
                channel: channel
            }, (err, argv, output) => {
                if (output) {
                    rtm.sendMessage(output, channel);
                }
            });
        }
    });
}

function registerCommands() {
    commands
        .command('ping', 'Pong!', {}, (argv) => {
            rtm.sendMessage('Pong!', argv.channel);
        })
        .command('history', 'Show all history logs', {}, (argv) => {
            MessageHistory.find({}).exec()
                .then((results) => {
                    results.forEach((message) => {
                        rtm.sendMessage(`${message.userId}: ${message.text}`, argv.channel);
                    })
                });
        })
        .command('channel', 'Show channelId', {}, (args) => {
            console.log('channel', args);
        })
        .command('*', false, {}, (argv) => {
            rtm.sendMessage('What do you mean? Don\'t talk to me about life.', argv.channel);
        });

}