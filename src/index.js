require('dotenv').config();

const { Client, Intents } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

// create client instance

const COMMANDS = ['play', 'stop'];

const connectChannel = channel => {
  const VoiceConnection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  return VoiceConnection;
};

const audioResource = songUrl => {
  const resource = createAudioResource(
    ytdl(songUrl, {
      quality: 'highestaudio',
    }),
    {
      inlineVolume: true,
    }
  );

  resource.volume.setVolume(1);

  return resource;
};

const audioPlayer = connection => {
  const player = createAudioPlayer();
  connection.subscribe(player);

  return player;
};

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const getSongURL = async songName => {
  const response = await yts(songName);

  if (response.videos.length > 0) {
    return response.videos[0].url;
  } else {
    return null;
  }
};

// Run bot

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('messageCreate', async message => {
  const args = message.content.trim().slice(1).split(/ +/g);
  const command = args[0].toLowerCase();
  const songName = args.slice(1).join(' ');

  if (message.author.id === '904069463412965408') {
    setTimeout(async () => {
      await message.delete();
    }, 1000);
  }

  if (!message.content.startsWith('~') || message.author.bot) return;

  const execute = async message => {
    const voiceChannel = await message.member.voice.channel;

    if (!voiceChannel) {
      await message.reply('You must be in voice channel.');
    } else {
      const url = await getSongURL(songName);

      if (!url) {
        await message.reply(`Error. Your song is not available on Youtube!`);
        return;
      } else {
        const connection = connectChannel(voiceChannel);
        const resource = audioResource(url);
        const player = audioPlayer(connection);
        switch (command) {
          case 'play':
            player.play(resource);
            await message.reply(`Playing ${url}`);
            break;
          case 'stop':
            connection.destroy();
            break;
          default:
            null;
            break;
        }
      }
    }
  };

  if (!COMMANDS.includes(command)) {
    await message.reply('Command is not valid!');
  } else {
    execute(message);
  }
});

client.login(process.env.TOKEN);
