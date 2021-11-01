const { createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const getResource = async id => {
  const resource = createAudioResource(
    ytdl(`https://www.youtube.com/watch?v=${id}`, {
      quality: 'highestaudio',
    }),
    {
      inlineVolume: true,
    }
  );

  return {
    resource: resource,
  };
};

module.exports = { getResource };
