# MarvinJS for 42 Communities around the world.

The idea is to port over Marvin from 42 Silicon Valley into a modular, adaptive chatbot Node / JS server.

* NextJS for the online dashboard.
* Express server for communication with Slack.

Structure:

* src/dashboard
  * The web dashboard for the app
* src/database
  * Connection, Models and Migrations
* src/slack
  * Connection, Commands, Nessesary Routes, (History) Logger
* server
  * Express / NextJS server and initialiser

## Start Developing

```(bash)

npm run install
npm run dev
```

Start a mongodb database using Docker-Compose

```(bash)
docker-compose up database
```

