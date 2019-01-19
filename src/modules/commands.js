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
            const command = text.replace(`<@${rtm.activeUserId}>`, '').trim();
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
    commands
        .command('ping', 'Pong!', {}, ({ message }) => {
            rtm.sendMessage('Pong!', message.channel);
        })
        .command('factoid <create|list>', 'Manage factiods within slack.', (yargs) => {
            return yargs
                .command('create <command> [response]', 'Create factoids using snippets or text responses', {}, async ({ command, response, message, ...argv}) => {
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
        })
        .command('history', 'Show all history logs', {}, (argv) => {
            MessageHistory.find({}).exec()
                .then((results) => {
                    results.forEach((message) => {
                        rtm.sendMessage(`${message.userId}: ${message.text}`, argv.message.channel);
                    })
                });
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
        .command('*', false, {}, (argv, ...other) => {
            rtm.sendMessage('What do you mean? Don\'t talk to me about life.', argv.message.channel);
        });

}