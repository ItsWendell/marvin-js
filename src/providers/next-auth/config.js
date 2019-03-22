import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
import Functions from './functions';

import * as strategies from './strategies';

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

console.log('strategies', strategies);

const appUrl = getAppUrl();

export default expressApp => {
  return Functions().then(functions => {
    return new Promise(async (resolve, reject) => {
      resolve({
        sessionSecret: process.env.APP_SECRET || process.env.INTRA42_CLIENT_SECRET,
        sessionMaxAge: 60000 * 60 * 24 * 7,
        sessionRevalidateAge: 60000,
        serverUrl: appUrl.substring(0, appUrl.length - 1),
        expressSession,
        sessionStore,
        providers: Object.values(strategies),
        functions: await Functions(),
        expressApp: expressApp || undefined
      });
    });
  });
};
