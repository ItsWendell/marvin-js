import moment from 'moment';
import commands from '../providers/commands';
import { rtm } from '../slack';

import MessageHistory from '../database/models/message-history';

import * as vm from '../providers/vm';
import Factoid, { FactoidTypes } from '../database/models/factoid';

export function activate() {
    registerCommands();

    rtm.on('message', (message) => {
        const { text, user, channel } = message;
        // Skip messages that are from a bot or my own user ID, or are for factoids.
        if (!text || (message.subtype && message.subtype === 'bot_message') ||
            (!message.subtype && user === rtm.activeUserId) ||
            text.startsWith('!')) {
            return;
        }

        // Only listen to commands which are sent using @user and as a direct message.        
        if (channel.startsWith('D') || text.includes(`<@${rtm.activeUserId}>`)) {
            var command = text.replace(`<@${rtm.activeUserId}>`, '').trim();

            // Change first word of command to lower case
            command = [
                command.trim().split(' ')[0].toLowerCase(),
                ...command.trim().split(' ').slice(1)
            ].join(' ');

            commands.parse(command, {
                message
            }, (err, argv, output) => {
                if (output) {
                    rtm.sendMessage(output, channel);
                }
            });
        }
    });
}

function registerCommands() {
    const userId = rtm.activeUserId;
    commands
        .usage(`Usage: Send me a direct message or mention me (<@${userId}>) with the command!`)
        .epilogue('For more information, checkout our Github: https://github.com/ItsWendell/marvin-js/')
        .wrap(null)
        .command('ping', 'Pong!', {}, ({ message }) => {
            rtm.sendMessage('Pong!', message.channel);
        })
        .command('history', 'Show all history logs.', {}, ({ message }) => {
            rtm.sendTyping();
            MessageHistory.find({ channelId: message.channel }).sort({ 'date': -1 }).limit(20).exec()
                .then((results) => {
                    const messages = results.map((message) => {
                        return (`${message.userId}: ${message.text}`);
                    }).join('\n');
                    rtm.sendMessage(
                        `Latest 20 messages from this channel: \n` +
                        `_(This is a limited proof of concept, all history will be available in the dashboard soon.)_\n\n` +
                        messages,
                        message.channel
                    );
                });
        })
        .command('server', 'List basic server / process information.', {}, (argv) => {
            const rssMB = process.memoryUsage().rss / (1024 * 1024);
            const uptime = moment.duration({
                seconds: process.uptime()
            });
            const uptimeString = `${uptime.days()} days, ${uptime.hours()} hours, ${uptime.minutes()} minutes, ${uptime.seconds()} seconds`;
            const stats = `Server statistics:\n` +
                `Platform: ${process.platform}\nNodeJS: ${process.version}\n` +
                `Uptime: ${uptimeString}\n` +
                `RSS Memory: ${rssMB} MB\n`;
            rtm.sendMessage(stats, argv.message.channel);
        })
        .command('slack', 'Fetch basic information about slack.', (yargs) => {
            return yargs
                .showHelpOnFail(true)
                .demandCommand(1, '')
                .usage(`Info: Might be useful for creating factoids or debugging.`)
                .command([
                    'whoami',
                    'me',
                ], 'Your slack user id', {}, ({ message }) => {
                    rtm.sendMessage(`Hi <@${message.user}>, your slack user id is: ${message.user}`, message.channel);
                })
                .command([
                    'whereami',
                    'channel',
                ], 'Current slack channel id', {}, ({ message }) => {
                    rtm.sendMessage(`You're in <#${message.channel}>, this slack channel id is: ${message.channel}`, message.channel);
                })
        })
        .command('*', false, {}, ({ message }) => {
            rtm.sendMessage('What do you mean? Don\'t talk to me about life.', message.channel);
        });
}