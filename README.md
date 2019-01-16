# MarvinJS

MarvinJS is a community / campus bot for Slack inspired by [Marvin, a Slack bot for 42 USA](https://github.com/riking/marvin).

## Goals

As this project is still in early development, here are a couple of goals and features for this project.

* Easy configuration and deployment
* Support for user-generated content through Factoids / modules
* Web Interface
* Slack History logger

## Getting started

To get the bot running, we'll need a Bot Token from Slack and a Slack App. Read the [Getting Started](https://api.slack.com/bot-users#getting_started) guide on Slack, step 2 is not nessesary here (for now).

Once you have a bot token set the token in your .env file in the root folder of the application.

```(env)
SLACK_TOKEN=YOUR-BOT-TOKEN-HERE
```

If you want to test the 42 intranet integration you'll need an app secret and key from 42. [Read more about this here.](https://api.intra.42.fr/apidoc/guides/getting_started#create-an-application).

```(env)
INTRA42_CLIENT_ID=
INTRA42_CLIENT_SECRET=
INTRA42_CAMPUS_ID=
```

(Optionally set your primary campus for the bot)

Run a local MongoDB database with [Docker Compose](https://docs.docker.com/compose/install/) in a seperate console;

```(bash)
docker-compose up database
```

If you're running this bot in production, or running your database on a different port or host, you can set the variable `DATABASE_URL` in your .env file.

Install node packages and run the dev command and you're ready to go!

```(bash)
npm install
npm run dev
```

## Commands

There are a few basic commands that are integrated that you can list by either talking to MarvinJS directly in a Direct Message, or @ tagging him.

To list those commands you can say !help.

## Factiods

Factoids are running as `!help`, explanation mark commands. Factoids are simple community contriubted commands that can be created from Slack. You can use Factoids to store frequently asked questions, for example a `!wifi` command that explains how to connect to Wi-Fi.

Factiods now only support text but we're looking to supporting custom scripts with for example Lua or Javascript soon, so community members can contribute handy snippets.
