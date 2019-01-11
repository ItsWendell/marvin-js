import { RTMClient, WebClient } from '@slack/client';
import * as logger from './logger';
import commands from './commands';

const SLACK_TOKEN = process.env.SLACK_TOKEN;

if (!SLACK_TOKEN) {
  throw new Error('SLACK_TOKEN not set in .env file');
}

// Initialize clients
const rtm = new RTMClient(SLACK_TOKEN);
const web = new WebClient(SLACK_TOKEN);

// Initialize basic events
rtm.on('connected', () => {
  console.log('[Slackbot] Connected to Slack!');
  web.channels.list().then(({ channels, ...data }) => {
    console.log('[Slackbot] Slack channels:', channels.map((channel) => channel.name).join(', '));
    logger.listen();
  });
});

// We've received a message from someone (user), somehere (channel). 
rtm.on('message', ({ text, user, channel, ...message }) => {
  // For structure of `message`, see https://api.slack.com/events/message

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

export { rtm, web };