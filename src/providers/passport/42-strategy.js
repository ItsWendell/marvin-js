import { Strategy as FortyTwoStrategy } from 'passport-42';
import { getAppUrl } from '../../utilities';

export default new FortyTwoStrategy({
  clientID: process.env.INTRA42_CLIENT_ID,
  clientSecret: process.env.INTRA42_CLIENT_SECRET,
  callbackURL: getAppUrl("/auth/42/callback")
},
  function (accessToken, refreshToken, profile, cb) {
    // TODO: ?
    User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
)