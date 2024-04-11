module.exports = {
	responses: {
		clean: [
			'Just cleaned up all the messages!',
			'Now this place is looking nice and tidy!',
		],
		join: [
			'I\'m locked in and ready to play some tunes!',
			'I\'m here to DJ for you! What do you want to hear?',
			'Time to blast some music!',
			'What kind of music are you feeling today?',
			'Dropping the needle on whatever you want to hear!',
			'Request your jams and I\'ll give them a spin!',
			'Ready to turn up the volume! What song should we blast first?',
			'Aurora is here to play the Captain\'s tunes! What do you want to hear?',
		],
		error: [
			'Uh oh! There might be a glitch in the system!',
			'Something has gone wrong. Give me a moment.',
			'Hmm... that didn\'t work as expected. Try again in a moment.',
			'Oh! Looks like I malfunctioned a bit. Give me a chance to reset.',
			'Uh oh! There seems to be an issue. Please try again later.',
		],
		leave: [
			'Alright, I\'m out of here!',
			'Sorry! I\'ve gotta run for a bit!',
		],
	},

	getResponse(type) {
		if (!this.responses[type]) {
			console.warn(`Response type "${type}" not found.`);
			return null;
		}
		const responses = this.responses[type];
		const randomIndex = Math.floor(Math.random() * responses.length);
		return responses[randomIndex];
	},
};
