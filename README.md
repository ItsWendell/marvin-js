# MarvinJS

MarvinJS is a community bot for Slack inspired by [Marvin, a Slack bot for 42 USA](https://github.com/riking/marvin).

## Goals

As this project is still in early development, here are a couple of goals and features for this project.

* Easy configuration and deployment
* Support for user-generated content through Factoids / modules
* Web Interface
* Slack History logger

## Getting started

We'll need a Bot Token from slack and a Slack App. Read the [Getting Started](https://api.slack.com/bot-users#getting_started) guide on Slack, skip step 2 (for now).

Once you have a bot token set the token in your .env file in the root folder of the application.

```(env)
SLACK_TOKEN=YOUR-BOT-TOKEN-HERE
```

Run a database with [Docker Compose](https://docs.docker.com/compose/install/) in a seperate console;

```(bash)
docker-compose up database
```

Install node packages and run the dev command and you're ready to go!

```(bash)
npm install
npm run dev
```

You can ping Marvin using `!ping`

Feel free to help out with this project!