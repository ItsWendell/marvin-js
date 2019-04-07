import { Strategy as SlackStrategy } from 'passport-slack';

export default (process.env.SLACK_CLIENT_ID && process.env.SLACK_CLIENT_SECRET
  ? {
      providerName: 'slack',
      providerOptions: {
        scope: ['identity.basic', 'channels:read', 'groups:read'],
        team: process.env.SLACK_WORKSPACE
      },
      Strategy: SlackStrategy,
      strategyOptions: {
        clientID: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET
      },
      getProfile(profile) {
        console.log('PROFILE SLACK', profile);
        // Normalize profile into one with {id, name, email} keys
        return {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.user && profile.user.email
        };
      }
    }
  : {});
