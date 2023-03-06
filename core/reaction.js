module.exports = {
    name: 'messageCreate',
    async execute(message) {
      if (message.author.bot || message.channel.type === 'DM') return;
  
      const keywords = ['bestie'];
      const emoji = '🤍';
  
      if (keywords.some(word => message.content.toLowerCase().includes(word))) {
        try {
          await message.react(emoji);
        } catch (error) {
          console.log(`I could not react to this message: ${error}`);
        }
      }
    }
  };