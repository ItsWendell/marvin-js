import yargs from 'yargs';
import * as vm from '../providers/vm';
import commands from '../providers/commands';
import { rtm } from '../slack';

import Factoid, { FactoidTypes } from '../database/models/factoid';

export const factoidCommands = yargs()
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
    registerCommands();

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

export function registerCommands() {
    commands
        .command([
            'factoid',
            'factoids'
        ], 'Manage factoids within slack.', (yargs) => {
            return yargs
                .showHelpOnFail(true)
                .demandCommand(1, '')
                .command('create <command> [response]', 'Create factoids using snippets or text responses', {}, async ({ command, response, message, ...argv }) => {
                    // Upload snippets to the factoid database.
                    if (message && message.files) {
                        // Filter only javascript snippets which are not truncated .
                        const snippets = message.files.filter((file) =>
                            file.filetype === 'javascript' && file.preview_is_truncated === false
                        );

                        if (snippets.length) {
                            const snippet = snippets[0];
                            try {
                                const newFactoid = new Factoid({
                                    command: command,
                                    type: FactoidTypes.Javascript,
                                    response: snippet.preview,
                                });

                                await vm.runScriptContext(snippet)
                                await newFactoid.save();
                                rtm.sendMessage('Factiod saved!', message.channel);
                            } catch (error) {
                                if (error.name === 'MongoError' && error.code === 11000) {
                                    rtm.sendMessage(`Factoid \`!${command}\` already exists!`, message.channel);
                                } else {
                                    rtm.sendMessage(`Something went wrong: ${error.message}`, message.channel);
                                }
                            }
                        }
                        else {
                            rtm.sendMessage('You should attach a Javascript snippet / file as code!', message.channel);
                        }
                    } else if (response && message) {
                        const newFactiod = new Factoid({
                            command: command,
                            response: response,
                        });

                        try {
                            await newFactiod.save();
                            rtm.sendMessage('Factiod saved!', message.channel);
                        } catch (error) {
                            if (error.name === 'MongoError' && error.code === 11000) {
                                rtm.sendMessage(`Factoid \`!${command}\` already exists!`, message.channel);
                            }
                        }
                    } else {
                        rtm.sendMessage('There is no valid response or snippet available to create a factoid', message.channel);
                    }
                })
                .command('list', 'List all available factoids.', {}, ({ message }) => {
                    Factoid.find({}).exec()
                        .then((data) => {
                            const commandsString = data.map((item) => item.command).join(', ')
                            rtm.sendMessage(`Factoids available: ${commandsString}`, message.channel);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .command('run [code..]', 'Run / Test code for factoids. (Upload code as snippet)', {}, ({ _: params, code, message }) => {
                    if (message.files) {
                        const snippets = message.files.filter((file) =>
                            file.filetype === 'javascript' && file.preview_is_truncated === false
                        );
        
                        snippets.forEach((snippet) => {
                            vm.runScriptContext(snippet.preview, message);
                        });
                    } else if (code) {
                        const snippet = code.join(' ');
                        vm.runScriptContext(snippet, message);
                    } else {
                        rtm.sendMessage('You should attach a Javascript snippet / file as code!', message.channel);
                    }
                })
        })
}