import { web, rtm } from '../../slack';
import command from '../commands';

export default class AppContext {
    constructor(message = {}) {
        this.message = message;
    }

    sendMessage = (text) => {
        rtm.sendMessage(text, this.message.channel);
    }
}
