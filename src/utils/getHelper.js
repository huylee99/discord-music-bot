const getHelper = string => {
  const args = string.trim().slice(1).split(/ +/g);
  const command = args[0].toLowerCase();
  const song = args.slice(1).join(' ');

  return { command, song };
};

module.exports = { getHelper };
