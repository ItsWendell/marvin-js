import scheduler from '../providers/scheduler';
import axios from 'axios';

export function activate() {
    if (process.env.APP_URL) {
        registerJobs();
    } else {
        throw new Error('Environment variable APP_URL is not set!');
    }
}

function registerJobs() {
    scheduler.scheduleJob('*/5 * * * *', () => {
        console.log('[KeepAwake]', `Pinging ${process.env.APP_URL}...`);
        axios
            .get(process.env.APP_URL)
            .then(() => {
                console.log('[KeepAwake]', `Succesfully pinged ${process.env.APP_URL}`);
            })
            .catch(() => {
                console.log('[KeepAwake]', `Error pinging ${process.env.APP_URL}`);
            });
    });
}