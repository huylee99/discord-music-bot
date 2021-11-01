const getUserFromMention = mention => {
  if (!mention) return;

  if (mention.startsWith('<@') && mention.endsWith('>')) {
    mention = mention.slice(2, -1);

    if (mention.startsWith('!')) {
      mention = mention.slice(1);
    }
  } else {
    return 'Parameter is not valid';
  }

  return mention;
};

module.exports = { getUserFromMention };
