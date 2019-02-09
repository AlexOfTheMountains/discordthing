module.exports = {
  commands : {
    swear: (msg, args) => {
      mentions = msg.mentions;

      if (mentions.users.array().length != 0) {
        mentioned = mentions.users.array();
        for (user in mentioned) {
          user = mentioned[user];
          msg.channel.send(`${msg.author.username} says fuck you <@${user.id}>`);
        }
      }
      else {
        msg.channel.send(`FUCK you too ${msg.author.username}`);
      }
    }
  }
};
