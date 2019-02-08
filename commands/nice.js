module.exports = {
  commands: {
    nice: (msg, args) => {
      msg.reply(`That's very nice ${msg.author.username}`);
    }
  }
};
