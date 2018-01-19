const express		= require('express');
const app				= express();
var		path			= require("path");

const arDrone = require("ar-drone")
var client = arDrone.createClient();

const speed = 0.2;

app.get('/', (req, res) => {
	console.log(path.join(__dirname + '/views/control.html'));
	res.sendFile(path.join(__dirname + '/views/control.html'));
});

app.get('/control/:param', (req, res) => {
	console.log(req.url);
	controlString = req.params['param'];
	console.log("The guy clicked the button to " + controlString);

	switch(controlString) {
		case 'stop':
			client.stop();
			break;
		case 'takeoff':
			client.takeoff()
			break;
		case 'land':
			client.land();
			break;
		case 'left':
			client.left(speed);
			break;
		case 'right':
			client.right(speed);
			break;
		case 'front':
			client.front(speed);
			break;
		case 'back':
			client.back(speed);
			break;
		case 'counter':
			client.counterClockwise(speed);
			break;
		case 'clockwise':
			client.clockwise(speed);
			break;
	}

	res.redirect(req.header('Referer'));
});

app.listen(3000, () => console.log('Drone server listening on port 3000!'));
