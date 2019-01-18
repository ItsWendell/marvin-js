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
        .command('coalitions', 'Coalition commands of the 42 network.', {}, (argv) => {
            sendCoalitionStats(argv.channel);
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