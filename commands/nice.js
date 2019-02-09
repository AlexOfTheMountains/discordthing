module.exports = {
  commands: {
    nice: (msg, args) => {
      msg.reply(`That's very nice ${msg.author.username}`);
    },
    reallynice: (msg, args) => {
      msg.reply(`That's really nice ${msg.author.username}`);
    }
  }
};
