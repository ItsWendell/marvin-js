import { rtm } from '../../slack';

export default class AppContext {
  constructor(message = {}) {
    this.message = message;
  }

  sendMessage = text => {
    rtm.sendMessage(text, this.message.channel);
  };
}
