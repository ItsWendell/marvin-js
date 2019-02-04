import 'dotenv/config';
import * as Sentry from '@sentry/node';
import express from 'express';
import './providers/prototypes';

import { rtm, routes as SlackRoutes } from './slack';
import dashboard from './dashboard';
import database, { models } from './database';
import * as modules from './modules';

const port = parseInt(process.env.PORT, 10) || 3000;

const handle = dashboard.getRequestHandler();

const server = express();

/**
 * Sentry Implementation
 * @see https://docs.sentry.io/
 */
if (process.env.SENTRY_DNS) {
  Sentry.init({ dsn: process.env.SENTRY_DNS });
  server.use(Sentry.Handlers.requestHandler());
  server.use(Sentry.Handlers.errorHandler());
}

// We want to continue to run the server when asynchronous code fails
process.on('uncaughtException', (err) => {
  console.error('[Server] Asynchronous error caught:', err.message);
});

function loadModules() {
  let activateModules = Object.keys(modules);

  // Disable certain modules within the environment file
  if (process.env.DISABLED_MODULES) {
    const disabledModules = (process.env.DISABLED_MODULES || '').split(',');
    const activateModules = disabledModules.filter((module) => (
      !disabledModules.includes(module)
    ));
    console.log('[Modules] Disabled Modules: ', disabledModules);
  }

  // Activate exported modules by key
  activateModules.forEach((key) => {
    if (typeof modules[key].activate === "function") {
      try {
        modules[key].activate();
        console.log('[Modules] Activated module', key);
      } catch (error) {
        console.log(`[Modules] Failed loading module ${key}, error: ${error.message}`);
      }
    }
  });
}

dashboard.prepare().then(() => {
  // Expose MongoDB to NextJS
  server.use((req, res, next) => {
    req.models = models;
    next();
  });

  // Integrate our slack routes
  server.use('/api/slack', SlackRoutes);

  /**
   * Return our nextJS dashboard pages.
   */
  server.get('*', (req, res) => {
    return handle(req, res)
  });

  /**
   * Catch error's and sent 500 errors instead of server failing...
   */
  server.use((err, req, res, next) => {
    res.statusCode = 500;
    res.end(res.sentry + '\n');
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`[Server] Ready on http://localhost:${port}`);
    // Connect to MongoDB
    database.connect()
      .then(() => {
        console.log('[Database] Connected to', database.host);
        // Connect to Slack Real Time Chat
        rtm.start().then(() => {
          // Load MarvinJS modules
          loadModules();
        });
      })
      .catch((error) => {
        console.log('[Database]', error.message);
        throw error;
      });
  });
});

