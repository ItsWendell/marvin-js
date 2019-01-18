import scheduler from '../../providers/scheduler';
import { sendCoalitionStats } from './intra42';

export function register() {
    // Send daily updates to general channel with coalition updates
    scheduler.scheduleJob('0 10 * * *', () => {
        console.log('[Jobs] Sending Coalition Stats...');
        sendCoalitionStats();
    });
}