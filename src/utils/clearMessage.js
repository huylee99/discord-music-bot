const clearMessage = (message, prefix) => {
  if (message.author.bot || message.content.startsWith(prefix)) {
    setTimeout(async () => {
      await message.delete();
    }, 1500);
  }
};

module.exports = { clearMessage };
