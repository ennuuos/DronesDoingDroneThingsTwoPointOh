const express		= require('express');
const app				= express();
const	path			= require("path");
const ping			= require('ping');

const arDrone = require("ar-drone")
var client = arDrone.createClient();

const speed = 0.2;

var droneAddressPrefix = "192.168.1.10";
var pingAddress = (addr) => {
	ping.sys.probe(addr, function(isAlive){
			var msg = isAlive ? 'drone ' + addr + ' is alive' : 'drone ' + addr + ' is dead';
			console.log(msg);
	});
};

var createClient = (id) => {

};

for(id = 0; id < 10; id++) {
	pingAddress(droneAddressPrefix + id);
}


app.get('/', (req, res) => {
	console.log(path.join(__dirname + '/views/control.html'));
	res.sendFile(path.join(__dirname + '/views/control.html'));
});

app.get('/control/:id/:param', (req, res) => {
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
