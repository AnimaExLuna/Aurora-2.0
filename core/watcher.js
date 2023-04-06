const censored = require('../db/censored.js');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || message.channel.type === 'DM') return;

    for (const word of censored) {
      if (message.content.toLowerCase().includes(word.toLowerCase())) {
        await message.delete();
        await message.channel.send(`You should maybe try and use some nicer words, ${message.author}, yeah?`);
      }
    }
  }
};
