import yargs from 'yargs';
import * as vm from '../providers/vm';
import { rtm } from '../slack';

import Factoid, { FactoidTypes } from '../database/models/factoid';

export const commands = yargs()
    .usage('usage: $0 !<command>')
    .scriptName('')
    .command('*', false, {}, ({ message, ...argv }) => {
        Factoid.findOne({ command: argv._[0] }).exec()
            .then((result) => {
                if (result) {
                    if (result.type === FactoidTypes.Javascript) {
                        vm.runScriptContext(result.response, message);
                    } else {
                        rtm.sendMessage(result.response, message.channel);
                    }
                }
            });
    });

export function activate() {
    rtm.on('message', (message) => {
        const { text, user, channel } = message;
        // Skip messages that are from a bot or my own user ID
        if ((message.subtype && message.subtype === 'bot_message') ||
            (!message.subtype && user === rtm.activeUserId)) {
            return;
        }

        if (text && text.startsWith('!')) {
            commands.parse(text.substr(1), {
                message
            }, (err, argv, output) => {
                if (output) {
                    rtm.sendMessage(output, channel);
                }
            });
        }
    });
}