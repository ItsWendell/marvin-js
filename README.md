# MarvinJS

MarvinJS is a campus Slack bot for the Encole 42 college network, inspired by [Marvin, a Slack bot for 42 USA](https://github.com/riking/marvin).

Instead of being written in Go, MarvinJS is a node server written in ES6 / Javascript with a server-side rendered NextJS dashboard.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ItsWendell/marvin-js/tree/develop)
*Heroku deployment is expirimental and in staging mode*

## Join us

We've a staging / demo bot running at Slack https://marvinjs.slack.com/ and on https://marvinjs-staging.herokuapp.com/, join us with improving marvinJS!

[Join us on slack!](https://join.slack.com/t/marvinjs/shared_invite/enQtNTI3NzIwMjYxMDA4LWViMjc3YWIxNTQ5N2ZhMzE2Y2E5Y2I5ZDIyMGY4YjkyMGJlZWRhZTQzZWM0OTAwNDBiMmU0OTFjMjJjNDFlMTY)

## Features / Goals

As this project is still in early development, here are the goals / features we want to have implemented before we offically suggest to implement this bot in one of the campusses.

* User-Generated Factoids / Commands (*implemented*)
* Chat History (*partly implemented*)
* Intra42 API Commands (*partly implemented*)
* (Private) Channel Management (*not yet implemented*)
* Daily Updates for e.g. Coalitions for the primary campus (*implemented*)
* Feeds (Twitter / RSS) (*not implemented yet*)
* Bot Dashboard (*not yet fully implemented*)
  * Write factoids
  * See Chat History
  * Login with your slack / or intra account
  * Channel overview
  * Private channels

## Getting started

To get the bot running, we'll need a Bot Token from Slack and a Slack App. Read the [Getting Started](https://api.slack.com/bot-users#getting_started) guide on Slack, step 2 is not nessesary here (for now).

Once you have a bot token set the token in your .env file in the root folder of the application.

```(env)
SLACK_TOKEN=YOUR-BOT-TOKEN-HERE
```

If you want to test the 42 intranet integration you'll need an app secret and key from 42. [Read more about this here.](https://api.intra.42.fr/apidoc/guides/getting_started#create-an-application). For this bot to be useful for other purposes we'll focus on making the intranet integration as modular as possible.

```(env)
INTRA42_CLIENT_ID=
INTRA42_CLIENT_SECRET=
INTRA42_CAMPUS_ID=
```

Run a local MongoDB database with [Docker Compose](https://docs.docker.com/compose/install/) in a seperate console;

```(bash)
docker-compose up database
```

If you're running this bot in production, or running your database on a different port or host, you can set the variable `MONGODB_URI` in your .env file.

Install node packages and run the dev command and you're ready to go!

```(bash)
npm install
npm run dev
```

## Commands

There are a few basic commands that are integrated that you can list by either talking to MarvinJS directly in a Direct Message, or @ tagging him.

To list those commands you can simply DM the bot and say `help`.

### Intra42 commands

Here are the currently implemented intra42 commands:

* `intra coalitions` - Shows the primary campus of the bot coalition points.
* `intra hours <username>` - Show the hours logged in this week of the provided username.

The coalitions command is also scheduled to run everyday at 10 in the morning in the primary general slack channel of the workspace.

## Factoids

Factoids are running as (`!wifi`) explanation mark commands. Factoids are simple user-generated commands that can be created using the `factoid` command or in the dashboard. You can use factoids to store frequently asked questions, for example a `!wifi` command that explains how to connect to Wi-Fi.

Example:

`factoid create wifi "See how to connect with wifi here \<link\>"`

### JavaScript Factoids

JavaScript factoids run in an isolated vm context with support for the following objects and functions:

* `message` - Slack object with the RTM Message. [Message Event @ Slack](https://api.slack.com/events/message)
* `sendMessage(message)` - Sends a message back to the incoming message sender.
* `axios` - A promise based http client, [axios](https://github.com/axios/axios) for simple http requests. e.g. `axois.get(url).then(callback)`

Example code for a javascript factoid:

```(javascript)
axios
.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
    .then(function (response) {
        sendMessage(`Bitcoin Price: ${response.data.USD} USD`);
    });
```

To create javascript factoids you have to upload it as a JavaScript file / snippet in Slack with the message `factoid create bitcoin` for the example mentoined above.