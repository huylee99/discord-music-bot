const axios = require('axios').default;

const getSong = async song => {
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${song}&key=${process.env.GAPI}`
  );

  const { snippet, id } = response.data.items[0];

  return { id: id.videoId, title: snippet.title };
};

module.exports = { getSong };
