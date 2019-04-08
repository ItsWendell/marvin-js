import moment from 'moment';
import commands from '../../providers/commands';
import { client, sendCoalitionStats, fetchCoalitionStats } from './intra42';
import { rtm } from '../../slack';
import { chunk } from '../../providers/helpers';

export function register() {
  commands.command(['intra', 'intra42'], 'Commands related to the 42 intranet.', yargs => {
    return yargs
      .showHelpOnFail(true)
      .demandCommand(1, '')
      .command('coalitions', 'Coalition commands of the 42 network.', {}, ({ message }) => {
        sendCoalitionStats(message.channel);
      })
      .command('coalition-stats', 'Manual coalition update checker. (temporary)', {}, () => {
        fetchCoalitionStats(true);
      })
      .command(
        'hours <username>',
        'Return accurate checked in hours of an user this week.',
        {},
        ({ message, username, f: full }) => {
          const weekStart = moment()
            .utc()
            .startOf('isoWeek');
          const weekEnd = moment()
            .utc()
            .endOf('isoWeek');

          client
            .get(`/users/${username}/locations`, {
              range: {
                // Parse 2 extra days for longer sessions, more accurate data
                begin_at: `${weekStart
                  .clone()
                  .subtract(2, 'days')
                  .toISOString()},${weekEnd
                  .clone()
                  .add(2, 'days')
                  .toISOString()}`
              }
            })
            .then(data => {
              if (data && data.length) {
                // Add up a total duration of the current rage
                const totalDuration = data.reduce((duration, item) => {
                  let itemStart = moment.utc(item.begin_at);
                  let itemEnd = !item.end_at ? moment().utc() : moment.utc(item.end_at);

                  // If item is out of range of the week
                  if (
                    (itemStart.isBefore(weekStart) && itemEnd.isBefore(weekStart)) ||
                    itemStart.isAfter(weekEnd)
                  ) {
                    return duration;
                  }

                  // If item is starting before week but ending within week
                  if (itemStart.isBefore(weekStart) && itemEnd.isBefore(weekEnd)) {
                    itemStart = weekStart;
                  }

                  // If item end is after week end
                  if (itemEnd.isAfter(weekEnd)) {
                    itemEnd = weekEnd;
                  }

                  const itemDuration = moment.duration(itemEnd.diff(itemStart));
                  return duration.add(itemDuration);
                }, moment.duration({}));

                const activeSession = data.find(item => !item.end_at);

                // Calculate total hours
                const totalHours = totalDuration.days() * 24 + totalDuration.hours();

                rtm.sendMessage(
                  `${`${username} has ` +
                    `${totalHours} hours and ` +
                    `${totalDuration.minutes()} minutes ` +
                    `logged this week.`}${
                    activeSession
                      ? ` (Logged in at ${activeSession.host})`
                      : ` (Last seen: ${moment.utc(data[0].end_at).fromNow()})`
                  }`,
                  message.channel
                );
              } else {
                rtm.sendMessage(
                  `${username} hasn't been here yet this week, that slacker!`,
                  message.channel
                );
              }
            })
            .catch(error => {
              rtm.sendMessage(`Something went wrong: ${error.message}`, message.channel);
              throw error;
            });
        }
      )
      .command(
        ['user <username>', 'users <username>'],
        'Get basic user information.',
        {},
        ({ message, username }) => {
          client.getUser(username).then(user => {
            const courses = user.cursus_users
              .map(
                cursusUser =>
                  `${cursusUser.cursus.name}: ${moment.utc(cursusUser.begin_at).format('LL')}` +
                  ` (Lvl: ${cursusUser.level})`
              )
              .join('\n');
            const result =
              `${user.displayname} (${username}) (${user.pool_month} ${user.pool_year})\n` +
              `Wallet: ${user.wallet}\n` +
              `Courses:\n${courses}`;

            rtm.sendMessage(result, message.channel);
          });
        }
      )
      .command('online', 'List all the people currently logged in.', {}, ({ message }) => {
        if (!process.env.INTRA42_CAMPUS_ID) {
          rtm.sendMessage('Primary campus ID is not set.', message.channel);
        }

        client
          .getAll(`/campus/${process.env.INTRA42_CAMPUS_ID}/locations`, {
            filter: {
              active: true
            },
            per_page: 100
          })
          .then(data => {
            const count = data.length;
            const response = `There are currently ${count} users online in our campus!\n`;
            const results = data.map(({ user, host }) => {
              return `<https://profile.intra.42.fr/users/${user.login}|${user.login}>`;
            });

            rtm.sendMessage(response, message.channel);
            chunk(results, 50).forEach(items => {
              rtm.sendMessage(items.join(', '), message.channel);
            });
          })
          .catch(error => {
            rtm.sendMessage(`Something went wrong: ${error.message}`, message.channel);
          });
      })
      .command('*', false, {}, ({ message }) => {
        rtm.sendMessage("What do you mean? Don't talk to me about life.", message.channel);
      });
  });
}
