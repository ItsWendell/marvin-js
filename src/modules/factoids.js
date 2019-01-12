import yargs from 'yargs';
import { rtm } from '../slack';

import Factoid from '../database/models/factoid';
import MessageHistory from '../database/models/message-history';

export const commands = yargs()
    .usage('usage: $0 !<command>')
    .scriptName('')
    .command('factoid <create|list>', 'Manage factiods within slack.', (yargs) => {
        return yargs
            .command('create [command] [response]', 'child command of foo', {}, (argv) => {
                const newFactiod = new Factoid({
                    command: argv.command,
                    response: argv.response,
                });

                try {
                    newFactiod.save();
                    rtm.sendMessage('Factiod saved!', argv.channel);
                } catch (error) {
                    rtm.sendMessage(`${error.message}`, argv.channel);
                }

                console.log('New Factiod :D', newFactiod.response);
            })
            .command('list', 'list factoids', {}, (argv) => {
                Factoid.find({}).exec()
                    .then((data) => {
                        const commandsString = data.map((item) => item.command)
                        rtm.sendMessage(`Factoids available ${commandsString}`, argv.channel);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .command('clear', 'list factoids', {}, (argv) => {
                Factoid.find({}).remove().exec()
                    .then((data) => {
                        rtm.sendMessage(`Cleared out all factoids!`, argv.channel);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            });
    })
    .command('*', false, {}, (argv) => {
        Factoid.findOne({ command: argv._[0] }).exec()
            .then((result) => {
                if (result) {
                    rtm.sendMessage(result.response, argv.channel);
                }
            });
    });

export function activate() {
    rtm.on('message', ({ text, user, channel, ...message }) => {
        // Skip messages that are from a bot or my own user ID
        if ((message.subtype && message.subtype === 'bot_message') ||
            (!message.subtype && user === rtm.activeUserId)) {
            return;
        }

        if (text && text.startsWith('!')) {
            commands.parse(text.substr(1), {
                channel: channel
            }, (err, argv, output) => {
                if (output) {
                    rtm.sendMessage(output, channel);
                }
            });
        }
    });
}