const censored = require('../db/censored.js');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || message.channel.type === 'DM') return;

    function isPartOfWord(message, censoredWord) {
      const regex = new RegExp(`\\b(?<!\\w)${censoredWord}(?!\\w)\\b`, 'i');
      return regex.test(message);
    }

    for (const censoredWord of censored) {
      if (isPartOfWord(message.content, censoredWord)) {
        await message.delete();

        try {
          await message.author.send({
            content: `Hey there, ${message.member.displayName}. The word \`${censoredWord}\` is not allowed on the Aurora server. I'd like to keep a safe and open space for all members, so please make sure to keep the chat respectable and friendly at all times.`,
          });
        } catch (error) {
          console.error(`Error sending DM to ${message.author.tag}`, error);
        }
        break;
      }
    }
  }
};