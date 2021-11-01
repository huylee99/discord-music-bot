const { getSong } = require('../../utils/getSong');
const { AudioPlayerStatus } = require('@discordjs/voice');
const { embedMessage } = require('../../utils/embedMessage');
const { getResource } = require('../../utils/getResource');
const { subscription, queueList, audioPlayer } = require('../subscription');

const play = async (message, searchTerm) => {
  const song = await getSong(searchTerm);

  if (audioPlayer.state.status === AudioPlayerStatus.Playing) {
    await message.reply(`${song.title} is added to queue!`);
  }
  queueList.push(song);
  processQueue();
};

const stop = async message => {
  audioPlayer.stop();
  await message.reply('Stopped!');

  return;
};

const leave = async message => {
  subscription.get('voice').destroy();
  subscription.delete('voice');
  await message.channel.send('Bye!');

  return;
};

const queue = async message => {
  if (queueList.length === 0) {
    const { embed } = embedMessage({
      title: 'Queue is empty!',
      description: '',
    });
    await message.channel.send({ embeds: [embed] });
    return;
  }
  const list = queueList.map(
    (track, index) => `${index + 1}. ${track.title} \n`
  );

  const { embed } = embedMessage({
    title: 'Track list',
    description: list.join(' '),
  });

  await message.channel.send({ embeds: [embed] });
};

const skip = async message => {
  audioPlayer.stop();
  await message.channel.send('Skipped current song!');
  return;
};

const clear = async message => {
  queueList = [];
  await message.channel.send('Queue has been cleared!');
};

const processQueue = async () => {
  if (
    queueList.length === 0 ||
    audioPlayer.state.status !== AudioPlayerStatus.Idle
  ) {
    return;
  }

  const nextTrack = queueList.shift();
  const { resource } = await getResource(nextTrack.id);
  audioPlayer.play(resource);

  await subscription.get('channel').send(`Playing ${nextTrack.title}`);

  return;
};

audioPlayer.on('stateChange', async (oldState, newState) => {
  if (
    newState.status === AudioPlayerStatus.Idle &&
    oldState.status !== AudioPlayerStatus.Idle
  ) {
    processQueue();
    return;
  }
});

module.exports = { play, stop, leave, queue, skip, clear };
