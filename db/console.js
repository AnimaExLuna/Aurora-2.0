module.exports = {
  logStartup: function (client) {
    console.log(`Aurora > ${client.user.tag} is now online.`);
    console.log(`Aurora > Program started at: ${new Date()}`);
  },

  logBreak: function () {
    console.log(`Aurora > ----------------------------------`);
  },

  logInfo: function (message) {
    console.log(`Aurora > Info: ${message}`);
  },

  logError: function (message) {
    console.error(`Aurora > Error: ${message}`);
  },

  logWarning: function (message) {
    console.warn(`Aurora > Warning: ${message}`);
  },

  // Add more logging functions here as needed
}