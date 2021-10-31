const yts = require('yt-search');

const getSong = async song => {
  const response = await yts(song);
  if (response.videos.length > 0) {
    return response.videos[0].url;
  } else {
    return null;
  }
};

module.exports = { getSong };
