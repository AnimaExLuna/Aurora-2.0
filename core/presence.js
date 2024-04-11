const { ActivityType } = require('discord.js');
const setStatus = require('./status.js');
const console = require('../db/console.js');
const config = require('../db/config.json');

const setBotStatus = async (client) => {
	// Define a function to handle setting the bot's status based on the presence update
	const handlePresenceUpdate = (oldPresence, newPresence) => {
		// If the user whose presence updated is the owner
		if (newPresence.user.id === config.ownerID) {
			// console.logInfo(`Captain's new status: ${newPresence.status}`);
			// If the status has changed
			if (newPresence.status !== previousStatus) {
				// Set the bot's status based on the new status
				switch (newPresence.status) {
				case 'online':
					console.logInfo('The Captain is online!');
					setStatus(client, 'online');
					break;
				case 'dnd':
					console.logInfo('The Captain is busy at the moment.');
					setStatus(client, 'dnd');
					break;
				case 'idle':
					console.logInfo('The Captain seems to be away for a while.');
					setStatus(client, 'idle');
					break;
				default:
					console.logInfo('The Captain is offline. Setting default status...');
					setStatus(client, 'offline');
					break;
				}
			}
			// Update the previous status variable
			previousStatus = newPresence.status;
		}
	};

	// Initialize the previous status variable to offline
	let previousStatus = 'offline';

	// Register the presenceUpdate event listener
	client.on('presenceUpdate', handlePresenceUpdate);

	try {
		// Fetch the captain user
		const captain = await client.users.fetch(config.ownerID);

		// Get the captain's status from their presence, defaulting to offline
		const captainStatus = captain?.presence?.status || 'offline';


		// If the captain is online
		if (captainStatus === 'online') {
			try {
				console.logInfo('The Captain is online! Now activating tracking mode:');
				// Fetch the tracked status data
				const trackerStatus = await trackedStatus();
				console.logInfo(`Captain's tracker status: ${trackerStatus}`);

				// Set the bot's status based on the tracked status data
				const values = trackerStatus.online[Math.floor(Math.random() * trackerStatus.online.length)];
				const activityType = parseInt(values.type);
				const activityTypeString = ActivityType[activityType];
				const activityText = values.text[Math.floor(Math.random() * values.text.length)];
				client.user.setPresence({
					activities: [{
						name: activityText,
						type: activityType,
					}],
					status: 'online',
				});
				console.logInfo(`Activity set to: ${activityTypeString} ${activityText}`);
			}
			catch (error) {
				console.logError(`Error fetching captain's tracker status: ${error}`);
				// Set the bot's status to the default status
				setStatus(client, 'offline');
			}
		}
		else {
			console.logInfo('The Captain is offline. Setting default status...');
			// Set the bot's status to the default status
			setStatus(client, 'offline');
		}
	}
	catch (error) {
		console.logError(error);
		console.logError(`Error fetching captain's tracker status: ${error}`);
		// Set the bot's status to the default status
		setStatus(client, 'offline');
	}
};

module.exports = {
	setBotStatus,
};