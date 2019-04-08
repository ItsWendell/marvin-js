import moment from 'moment';
import { rtm, web, getGeneralChannel } from '../../slack';

import Intra42Client from './client';
import { CoalitionHistory } from '../../database/models';

import * as jobs from './jobs';
import * as commands from './commands';

export const coalitionInterval = 15;

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
          const generalChannel = await getGeneralChannel();

          if (!generalChannel) {
            throw new Error('[Job: coalitionUpdate] general ChannelId not found');
          }

          channel = generalChannel.id;
        }

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

export async function sendCoalitionUpdates(result, manual) {
  const topNow = result.sort((a, b) => b.score - a.score);

  const currentCoalition = topNow[0].slug;

  const history = await CoalitionHistory.find({
    _id: {
      $nin: topNow.map(item => item._id)
    }
  })
    .sort({
      createdAt: 'desc'
    })
    .limit(topNow.length);

  const topHistory = history.sort((a, b) => b.score - a.score);
  const historyCoalition = history && history.length && topHistory[0].slug;

  if ((history.length && currentCoalition !== historyCoalition) || manual) {
    const channel = await getGeneralChannel();
    const pointsDiff = topNow[0].score - topNow[1].score;
    rtm.sendMessage(
      `*${topNow[0].name}* is now leading, they just beat *${
        topNow[1].name
      }* by ${pointsDiff} points! Enjoy your *4.2% Bonus XP* while it lasts!`,
      channel.id
    );

    const formattedPoints = topNow
      .map((col, index) => `*${index + 1}. ${col.name}:* ${col.score} Points`)
      .join(' | ');
    rtm.sendMessage(formattedPoints, channel.id);
  }
}

export function fetchCoalitionStats(manual = false) {
  client
    .getBlocs({
      filter: {
        campus_id: process.env.INTRA42_CAMPUS_ID
      }
    })
    .then(async data => {
      try {
        const promises = data
          .map(bloc => bloc.coalitions)
          .flat()
          .map(item =>
            CoalitionHistory.create({
              coalitionId: item.id,
              name: item.name,
              slug: item.slug,
              score: item.score
            })
          );

        const result = await Promise.all(promises);

        await sendCoalitionUpdates(result, manual);
        console.log('[fetchCoalitionStats] Fetched new coalition states...');
      } catch (error) {
        console.log('[sendCoalitionStats]', error.message);
      }
    });
}
