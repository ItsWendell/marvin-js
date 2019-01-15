import yargs from 'yargs';

const commands = yargs()
    .usage('usage: $0 <command>')
    .scriptName('');

export default commands;
