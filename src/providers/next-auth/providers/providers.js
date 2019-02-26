import { Strategy as FortyTwoStrategy } from 'passport-42';

export default () => {
    let providers = []
    if (process.env.INTRA42_CLIENT_ID && process.env.INTRA42_CLIENT_SECRET) {
        providers.push({
            providerName: 'Intra42',
            providerOptions: {
                scope: ['public']
            },
            Strategy: FortyTwoStrategy,
            strategyOptions: {
                clientID: process.env.INTRA42_CLIENT_ID,
                clientSecret: process.env.INTRA42_CLIENT_SECRET,
                profileFields: ['id', 'login', 'displayname', 'email']
            },
            getProfile(profile) {
                // Normalize profile into one with {id, name, email} keys
                return {
                    id: profile.id,
                    displayName: profile.displayname,
                    email: profile._json.email
                }
            }
        })
    }
    return providers
}