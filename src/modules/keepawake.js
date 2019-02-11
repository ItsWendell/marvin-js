import axios from 'axios';
import scheduler from '../providers/scheduler';

export function activate() {
  if (process.env.APP_URL) {
    registerJobs();
  } else {
    throw new Error('Environment variable APP_URL is not set!');
  }
}

export function registerJobs() {
  scheduler.scheduleJob('*/5 * * * *', () => {
    console.log('[KeepAwake]', `Pinging ${process.env.APP_URL}...`);
    axios
      .get(process.env.APP_URL)
      .then(() => {
        console.log('[KeepAwake]', `Succesfully pinged ${process.env.APP_URL}`);
      })
      .catch(error => {
        console.log('[KeepAwake]', `Error pinging ${process.env.APP_URL}`);
        throw error;
      });
  });
}
