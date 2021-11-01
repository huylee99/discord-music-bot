const { MessageEmbed } = require('discord.js');

const embedMessage = ({ title, description }) => {
  const embed = new MessageEmbed()
    .setTitle(title)
    .setColor('#DC143C')
    .setDescription(description);

  return { embed };
};

module.exports = { embedMessage };
