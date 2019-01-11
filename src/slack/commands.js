import yargs from 'yargs';
import { rtm } from '../slack';
import Factoid from '../database/models/factoid';
import MessageHistory from '../database/models/message-history';

export default yargs
    .usage('usage: $0 !<command>')
    .scriptName('')
    .command('marvin', `Hi I'm Marvin!`, {}, () => {
        
    })
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
    .command('history', 'Manage factiods within slack.', (yargs) => {
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
    }, (argv) => {
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
        Factoid.findOne({ command: argv._[0] }).exec()
            .then((result) => {
                console.log('factoid found', result);
                if (result) {
                    rtm.sendMessage(result.response, argv.channel);
                }
            });
    });