import 'dotenv/config';
import express from 'express';

import { rtm, routes as SlackRoutes } from './slack';
import dashboard from './dashboard';
import database, { models } from './database';

const port = parseInt(process.env.PORT, 10) || 3000;

const handle = dashboard.getRequestHandler();

const server = express();

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
        rtm.start();
      })
      .catch((error) => {
        console.log('[Database]', error.message);
      })
  });
});

