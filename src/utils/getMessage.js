const getMessage = string => {
  const args = string.trim().slice(1).split(/ +/g);
  const command = args[0].toLowerCase();
  const searchTerm = args.slice(1).join(' ');

  return { command, searchTerm };
};

module.exports = { getMessage };
