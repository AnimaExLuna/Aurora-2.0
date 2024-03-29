const chalk = require('chalk');

module.exports = {
  logStartup: function (client) {
    console.log(`Aurora > ${client.user.tag} is now ${chalk.green('online')}.`);
    console.log(`Aurora > Program started at: ${new Date()}`);
  },

  logBreak: function () {
    console.log(`----------------------------------`);
  },

  logInfo: function (message) {
    console.log(`Aurora > ${chalk.blue('Info')}: ${new Date().toLocaleString()} - ${message}`);
  },

  logError: function (message) {
    console.error(`Aurora > ${chalk.red('Error')}: ${new Date().toLocaleString()} - ${message}`);
  },

  logWarning: function (message) {
    console.warn(`Aurora > ${chalk.yellow('Warning')}: ${new Date().toLocaleString()} - ${message}`);
  },

}
