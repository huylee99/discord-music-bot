const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');

const subscription = new Map();
const queueList = [];

const audioPlayer = createAudioPlayer();

const setSubscription = channel => {
  if (
    !subscription.get('voice') ||
    subscription.get('channelID') !== channel.id
  ) {
    const voiceConnection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    voiceConnection.subscribe(audioPlayer);
    subscription.set('voice', voiceConnection);
    subscription.set('channelID', channel.id);
  }
};

module.exports = { subscription, setSubscription, queueList, audioPlayer };
