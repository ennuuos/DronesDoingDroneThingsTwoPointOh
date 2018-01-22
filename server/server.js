const express		= require('express');
const app				= express();
const	path			= require("path");
const ping			= require('ping');

const arDrone = require("ar-drone")
var client = arDrone.createClient();

var drones = [];

const speed = 0.2;

var droneAddressPrefix = "192.168.1.10";

var address = (id) => {
	return droneAddressPrefix + id;
}
var pingAddress = (id) => {
	var addr = address(id);
	ping.sys.probe(addr, function(isAlive){
			var msg = isAlive ? 'drone ' + addr + ' is alive' : 'drone ' + addr + ' is dead';
			console.log(msg);
			if(isAlive) createClient(id);
	});
};

var createClient = (id) => {
	drones[id] = arDrone.createClient({ip: address(id)});
};

for(id = 0; id < 10; id++) {
	pingAddress(id);
}


app.get('/', (req, res) => {
	console.log(path.join(__dirname + '/views/control.html'));
	res.sendFile(path.join(__dirname + '/views/control.html'));
});

app.get('/control/:id/:param', (req, res) => {
	console.log(req.url);
	controlString = req.params['param'];
	id = req.params['id'];
	console.log("The guy clicked the button to " + controlString);

	switch(controlString) {
		case 'stop':
			drones[id].stop();
			break;
		case 'takeoff':
			drones[id].takeoff()
			break;
		case 'land':
			drones[id].land();
			break;
		case 'left':
			drones[id].left(speed);
			break;
		case 'right':
			drones[id].right(speed);
			break;
		case 'front':
			drones[id].front(speed);
			break;
		case 'back':
			drones[id].back(speed);
			break;
		case 'counter':
			drones[id].counterClockwise(speed);
			break;
		case 'clockwise':
			drones[id].clockwise(speed);
			break;
	}

	res.redirect(req.header('Referer'));
});

app.listen(3000, () => console.log('Drone server listening on port 3000!'));
