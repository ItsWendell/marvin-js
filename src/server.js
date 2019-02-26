import 'dotenv/config';
import * as Sentry from '@sentry/node';
import express from 'express';
import nextAuth from 'next-auth';

import nextAuthConfig from './providers/next-auth/config';
import { rtm, routes as SlackRoutes, web } from './slack';
import dashboard from './dashboard';
import database, { models } from './database';
import * as modules from './modules';
import { register } from './modules/intra42/jobs';

const port = parseInt(process.env.PORT, 10) || 3000;

const app = express();

// We want to continue to run the server when asynchronous code fails
process.on('uncaughtException', err => {
  console.error('[Server] Asynchronous error caught:', err.message);
  throw err;
});

async function loadModules() {
  let activateModules = Object.keys(modules);

  // Disable certain modules within the environment file
  if (process.env.DISABLED_MODULES) {
    const disabledModules = (process.env.DISABLED_MODULES || '').split(',');
    activateModules = disabledModules.filter(module => !disabledModules.includes(module));
    console.log('[Modules] Disabled Modules: ', disabledModules);
  }

  // Activate exported modules by key
  activateModules.forEach(key => {
    if (typeof modules[key].activate === 'function') {
      try {
        modules[key].activate();
        console.log('[Modules] Activated module', key);
      } catch (error) {
        console.log(`[Modules] Failed loading module ${key}, error: ${error.message}`);
      }
    }
  });
}

async function start() {
  await dashboard.prepare();

  // Load next-auth configuration and return config object
  const nextAuthOptions = await nextAuthConfig(app);

  // Prevent passing port to nextAuth, since we have our own express server.
  // TODO: Check if nessesary with our custom config file.
  if (nextAuthOptions.port) delete nextAuthOptions.port;

  // Pass Next.js (Dashboard) App instance and NextAuth options to NextAuth
  await nextAuth(dashboard, nextAuthOptions);

  // Integrate our slack routes
  app.use('/api/slack', SlackRoutes);

  app.get('/auth/logout', req => {
    req.logOut();
    req.logout();
    req.end('Logged out?');
  });

  // Next JS route handling
  app.get('*', (req, res) => {
    req.models = models;
    req.slackWeb = web;
    const nextRequestHandler = dashboard.getRequestHandler();
    return nextRequestHandler(req, res);
  });

  /**
   * Sentry Implementation
   * @see https://docs.sentry.io/
   */
  if (process.env.SENTRY_DNS) {
    console.log('[Sentry] Sentry enabled.');
    Sentry.init({ dsn: process.env.SENTRY_DNS });
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.errorHandler());
  }

  // Catch errors for sentry
  app.use((err, req, res, next) => {
    res.statusCode = 500;
    res.end(`${res.sentry} | THIS?\n`);
  });

  // Bind listener
  app.listen(port, err => {
    if (err) throw err;

    // Connect to MongoDB
    database
      .connect()
      .then(() => {
        console.log('[Database] Connected to database', database.db.databaseName);
        // Connect to Slack Real Time Chat
        rtm.start().then(async () => {
          // Load MarvinJS modules
          await loadModules();
          console.log(`[Server] Ready on port ${port}`);
        });
      })
      .catch(error => {
        console.log('[Database]', error.message);
        throw error;
      });
  });
}

start().catch(message => {
  console.log('[Server] Issue with not properly starting server', message);
});

export { app };
