import expressSession from 'express-session';
import * as connectMongo from 'connect-mongo';
import Providers from './providers';
import Functions from './functions';

import { getAppUrl } from '../../utilities';
import { MONGODB_URI } from '../../database';

const MongoStore = connectMongo(expressSession);

let sessionStore;

if (MONGODB_URI) {
  sessionStore = new MongoStore({
    url: MONGODB_URI,
    autoRemove: 'interval',
    autoRemoveInterval: 10, // Removes expired sessions every 10 minutes
    collection: 'sessions',
    stringify: false
  });
}

export default expressApp => {
  return Functions().then(functions => {
    return new Promise((resolve, reject) => {
      resolve({
        sessionSecret: process.env.APP_SECRET || process.env.INTRA42_CLIENT_SECRET,
        sessionMaxAge: 60000 * 60 * 24 * 7,
        sessionRevalidateAge: 60000,
        serverUrl: getAppUrl(),
        expressSession,
        sessionStore,
        providers: Providers(),
        functions: Functions(),
        expressApp: expressApp || undefined
      });
    });
  });
};
