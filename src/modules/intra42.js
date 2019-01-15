import { rtm } from '../slack';

import Intra42Client from '../providers/intra42';
import commands from '../providers/commands';

let client;

export function activate() {
    client = new Intra42Client(
        process.env.INTRA42_CLIENT_ID,
        process.env.INTRA42_CLIENT_SECRET
    );

    client.authorizeClient().then((tokens) => {
        console.log('[Intra 42] Connected to the 42 network!');
    });

    commands
        .command('intra', 'Commands for the Intranet of the 42 network.', (yargs) => {
            return yargs
                .command('blocs', 'List all coalition blocs.', {}, (argv) => {
                    rtm.sendTyping(argv.channel);
                    client.getBlocs().then((data) => {
                        const result = data.map((bloc) => {
                            const campusId = bloc.campus_id;
                            const coalitions = bloc.coalitions.map((col) => {
                                return ` * ${col.name}: ${col.score} Points`;
                            }).join('\n');
                            return `Campus: ${campusId}:\n${coalitions}`;
                        });

                        rtm.sendMessage(result.join('\n'), argv.channel);
                    });
                })
        })
}