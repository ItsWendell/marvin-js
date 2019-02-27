import { Strategy as FortyTwoStrategy } from 'passport-42';

export default () => {
  const providers = [];
  if (process.env.INTRA42_CLIENT_ID && process.env.INTRA42_CLIENT_SECRET) {
    providers.push({
      providerName: 'intra42',
      providerOptions: {
        scope: ['public', 'profile']
      },
      Strategy: FortyTwoStrategy,
      strategyOptions: {
        clientID: process.env.INTRA42_CLIENT_ID,
        clientSecret: process.env.INTRA42_CLIENT_SECRET,
        profileFields: {
          id: 'id',
          username: 'login',
          displayName: 'displayname',
          'name.familyName': 'last_name',
          'name.givenName': 'first_name',
          profileUrl: 'url',
          'emails.0.value': 'email',
          'phoneNumbers.0.value': 'phone',
          'photos.0.value': 'image_url'
        }
      },
      getProfile(profile) {
        // Normalize profile into one with {id, name, email} keys
        return {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value
        };
      }
    });
  }
  return providers;
};
