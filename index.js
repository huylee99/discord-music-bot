require('dotenv').config();
const {
  AudioPlayerStatus,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require('@discordjs/voice');
const { Client, Intents } = require('discord.js');
const { prefix } = require('./config.json');
const { getHelper } = require('./src/utils/getHelper');
const { getSong } = require('./src/utils/getSong');
const ytdl = require('ytdl-core');

const subscription = new Map();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const COMMANDS = ['play', 'stop'];

const audioPlayer = createAudioPlayer();

client.on('ready', () => console.log('Klee is ready!'));

client.on('messageCreate', async message => {
  if (message.author.bot || message.content.startsWith(prefix)) {
    setTimeout(async () => {
      await message.delete();
    }, 1500);
  }

  if (
    !message.content.startsWith(prefix) ||
    message.author.bot ||
    !message.guild
  ) {
    return;
  }

  let channel = message.member.voice.channel;

  const { command, song } = getHelper(message.content);

  if (!COMMANDS.includes(command)) {
    await message.reply('Command is not valid!');
    return;
  }

  if (command === 'play') {
    if (channel) {
      if (audioPlayer.state.status !== AudioPlayerStatus.Idle) {
        await message.reply('Queue feature is not available!');
        return;
      }

      if (!message.guild.me.voice.channel) {
        const voiceConnection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });

        voiceConnection.subscribe(audioPlayer);

        subscription.set('active', voiceConnection);
      }

      const songURL = await getSong(song);

      const resource = createAudioResource(
        ytdl(songURL, {
          quality: 'highestaudio',
        }),
        {
          inlineVolume: true,
        }
      );
      audioPlayer.play(resource);
      await message.channel.send(`Playing ${songURL}`);
    } else {
      await message.channel.send('Vào rồi mở nhạc!');
      return;
    }
  }

  if (command === 'stop') {
    audioPlayer.stop();
    await message.reply('Stopped song!');
  }

  if (command === 'leave') {
    subscription.get('active').destroy();
  }
});

client.login(process.env.TOKEN);
