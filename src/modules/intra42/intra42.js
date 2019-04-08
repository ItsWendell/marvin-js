import { rtm, web } from '../../slack';

import Intra42Client from './client';

import * as jobs from './jobs';
import * as commands from './commands';

export const client = new Intra42Client(
  process.env.INTRA42_CLIENT_ID,
  process.env.INTRA42_CLIENT_SECRET
);

export function activate() {
  if (!process.env.INTRA42_CLIENT_ID || !process.env.INTRA42_CLIENT_SECRET) {
    throw new Error('No client ID and secret found for the 42 Intra API');
  }

  client
    .authorizeClient()
    .then(tokens => {
      console.log('[Intra 42] Connected to the 42 network!');
    })
    .catch(error => {
      throw new Error(`Unable to connect to the 42 network. Error: ${error.message}`);
    });

  commands.register();
  jobs.register();
}

export function sendCoalitionStats(channelId = null) {
  client
    .getBlocs({
      filter: {
        campus_id: process.env.INTRA42_CAMPUS_ID
      }
    })
    .then(async data => {
      let channel = channelId;
      try {
        if (!channel) {
          const { channels } = await web.channels.list();
          const generalChannel = channels.find(item => item.name_normalized === 'general');

          if (!generalChannel) {
            throw new Error('[Job: coalitionUpdate] general ChannelId not found');
          }

          channel = generalChannel.id;
        }

        console.log('Coalition Data', data.map(bloc => bloc.coalitions));

        const result = data
          .map(bloc => {
            return bloc.coalitions.map(col => `*${col.name}:* ${col.score} Points`).join(' | ');
          })
          .join('\n');

        rtm.sendMessage(`Here are the current results for the coalitions:\n${result}`, channel);
      } catch (error) {
        console.log('[sendCoalitionStats]', error.message);
      }
    });
}
