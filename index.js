require('dotenv').config();
const { Client, Intents } = require('discord.js');
const { prefix } = require('./config.json');
const { getMessage } = require('./src/utils/getMessage');
const { COMMANDS } = require('./src/constant');
const {
  play,
  stop,
  leave,
  queue,
  skip,
  clear,
} = require('./src/core/command/index');
const { subscription, setSubscription } = require('./src/core/subscription');
const { clearMessage } = require('./src/utils/clearMessage');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.on('ready', () => console.log('Klee is ready!'));

client.on('messageCreate', async message => {
  clearMessage(message, prefix);
  subscription.set('channel', message.channel);

  const { command, searchTerm } = getMessage(message.content);
  if (
    !message.content.startsWith(prefix) ||
    message.author.bot ||
    !message.guild
  ) {
    return;
  }

  if (!COMMANDS.includes(command)) {
    await message.reply('Command is not valid!');
    return;
  }

  if (command === 'play') {
    const channel = message.member.voice.channel;
    if (channel) {
      setSubscription(channel);
      play(message, searchTerm);
    } else {
      await message.channel.send('Không vào mà đòi mở nhạc, cẹc');
    }
  }

  if (command === 'stop') {
    stop(message);
  }

  if (command === 'leave') {
    leave(message);
  }

  if (command === 'queue') {
    queue(message);
  }

  if (command === 'skip') {
    skip(message);
  }

  if (command === 'clear') {
    clear(message);
  }
});

client.login(process.env.TOKEN);
