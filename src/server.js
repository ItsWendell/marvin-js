import 'dotenv/config';
import express from 'express';

import { rtm, routes as SlackRoutes } from './slack';
import dashboard from './dashboard';
import database, { models } from './database';
import * as modules from './modules';

const port = parseInt(process.env.PORT, 10) || 3000;

const handle = dashboard.getRequestHandler();

const server = express();

function loadModules() {
  let activateModules = Object.keys(modules);

  if (process.env.DISABLED_MODULES) {
    const disabledModules = (process.env.DISABLED_MODULES || '').split(',');
    const activateModules = disabledModules.filter((module) => (
      !disabledModules.includes(module)
    ));
    console.log('[Modules] Disabled Modules: ', disabledModules);
  }

  activateModules.forEach((key) => {
    if (typeof modules[key].activate === "function") {
      modules[key].activate();
      console.log('[Modules] Activated module', key);
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
   * Return our nextJs web pages.
   */
  server.get('*', (req, res) => {
    return handle(req, res)
  });


  server.listen(port, err => {
    if (err) throw err;
    console.log(`[Server] Ready on http://localhost:${port}`);
    database.connect()
      .then(() => {
        console.log('[Database] Connected to', database.host);
        rtm.start().then(() => {
          loadModules();
        });
      })
      .catch((error) => {
        console.log('[Database]', error.message);
      })
  });
});

