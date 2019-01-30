import moment from 'moment';
import { rtm, web } from '../../slack';

import Intra42Client from './client';
import commands from '../../providers/commands';

import * as jobs from './jobs';

let client;

export function activate() {
    if (!process.env.INTRA42_CLIENT_ID || !process.env.INTRA42_CLIENT_SECRET) {
        throw new Error('No client ID and secret found for the 42 Intra API');
    }

    client = new Intra42Client(
        process.env.INTRA42_CLIENT_ID,
        process.env.INTRA42_CLIENT_SECRET
    );

    client.authorizeClient()
        .then((tokens) => {
            console.log('[Intra 42] Connected to the 42 network!');
        })
        .catch((error) => {
            throw new Error(`Unable to connect to the 42 network. Error: ${error.message}`);
        });

    commands
        .command([
            'intra42',
            'intra'
        ], 'Commands related to the 42 intranet.', (yargs) => {
            return yargs
                .showHelpOnFail(true)
                .demandCommand(1, '')
                .command('coalitions', 'Coalition commands of the 42 network.', {}, ({ message }) => {
                    sendCoalitionStats(message.channel);
                })
                .command('hours <username>', 'Return accurate checked in hours of an this week.', {}, ({ message, username, f: full }) => {
                    const weekStart = moment().utc().startOf('isoWeek');
                    const weekEnd = moment().utc().endOf('isoWeek');

                    client
                        .get(`/users/${username}/locations`, {
                            range: {
                                // Parse 2 extra days for longer sessions, more accurate data
                                begin_at: `${weekStart.clone().subtract(2, 'days').toISOString()},${weekEnd.clone().add(2, 'days').toISOString()}`,
                            }
                        })
                        .then((data) => {
                            if (data) {
                                // Add up a total duration of the current rage
                                const totalDuration = data.reduce((duration, item) => {
                                    let itemStart = moment.utc(item.begin_at)
                                    let itemEnd = !item.end_at ? moment().utc() : moment.utc(item.end_at);

                                    // If item is out of range of the week
                                    if ((itemStart.isBefore(weekStart) && itemEnd.isBefore(weekStart)) || itemStart.isAfter(weekEnd)) {
                                        return duration;
                                    }

                                    // If item is starting before week but ending within week
                                    if (itemStart.isBefore(weekStart) && itemEnd.isBefore(weekEnd)) {
                                        itemStart = weekStart;
                                    }

                                    // If item end is after week end
                                    if (itemEnd.isAfter(weekEnd)) {
                                        itemEnd = weekEnd;
                                    }

                                    const itemDuration = moment.duration(itemEnd.diff(itemStart));
                                    return duration.add(itemDuration)
                                }, moment.duration({}));

                                const activeSession = data.find((item) => !item.end_at);

                                // Calculate total hours
                                const totalHours = (totalDuration.days() * 24) + totalDuration.hours();

                                rtm.sendMessage(`${username} has ` +
                                `${totalHours} hours and ` +
                                `${totalDuration.minutes()} minutes` +
                                (activeSession ? ` (Logged in at ${activeSession.host})` : ``), message.channel);
                            }
                        })
                        .catch((error) => {
                            rtm.sendMessage(`Something went wrong: ${error.message}`, message.channel);
                        })
                })
                .command('auth', 'Reauthenticate the intra 42.', {}, ({ message }) => {
                    client.authorizeClient()
                        .then((tokens) => {
                            rtm.sendMessage(`Reauthenticated.`, message.channel);
                        })
                        .catch((error) => {
                            rtm.sendMessage(`Error: ${error.message}`, message.channel)
                        });
                })
        })

    jobs.register();
}

export function sendCoalitionStats(channelId = null) {
    client
        .getBlocs({
            filter: {
                campus_id: process.env.INTRA42_CAMPUS_ID,
            }
        })
        .then(async (data) => {
            try {
                if (!channelId) {
                    const { channels } = await web.channels.list();
                    const generalChannel = channels.find((channel) => !!channel.is_general);

                    if (!generalChannel) {
                        throw new Error('[Job: coalitionUpdate] general ChannelId not found');
                    }

                    channelId = generalChannel.id;
                }

                const result = data.map((bloc) => {
                    return bloc.coalitions.map((col) => (
                        `*${col.name}:* ${col.score} Points`
                    )).join(' | ');
                }).join('\n');

                rtm.sendMessage(`Here are the current results for the coalitions:\n${result}`, channelId);
            } catch (error) {
                console.log('[sendCoalitionStats]', error.message);
            }
        });
}

export { client };