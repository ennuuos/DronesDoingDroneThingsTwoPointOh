const	path			= require("path");
const express		= require('express');
const app				= express();
app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));
const ping			= require('ping');

const arDrone = require("ar-drone")
var client = arDrone.createClient();

var drones = {};

const speed = 0.2;

var droneAddressPrefix = "192.168.1.10";
var address = (id) => {
	return droneAddressPrefix + id;
}
var pingAddress = (id) => {
	var addr = address(id);
	ping.sys.probe(addr, function(isAlive){
			if(isAlive) {
				createClient(id);
			} else {
				if(drones[id] !== undefined) {
					delete drones[id];
					console.log("Drone " + id + " disconnected");
				}
			}
	}, {'timeout': 1});
};

var createClient = (id) => {
	if(drones[id] === undefined) {
		console.log("Drone " + id + " connected");
		drones[id] = arDrone.createClient({ip: address(id)});
	}
};


var pingAddresses = () => {
	for(id = 0; id < 10; id++) {
		pingAddress(id);
	}
}
setInterval(pingAddresses, 1000);

// Debug clients
// createClient(0);
// createClient(1);


app.use(express.static(__dirname + 'views'));

app.get('/', (req, res) => {
	res.render('index', {title: "Drone Control", ids: Object.keys(drones)})
});

app.get('/control/refresh', (req, res) => {
	console.log("Refreshing")
	for(id = 0; id < 10; id++) {
		pingAddress(id);
	}
});

app.get('/control/:id/:param', (req, res) => {
	console.log(req.url);
	controlString = req.params['param'];
	id = req.params['id'];
	if(drones[id] == undefined) {
		console.log("Id " + id + " is undefined.");
	} else {
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
	}
	res.redirect(req.header('Referer'));
});

app.listen(3000, () => console.log('Drone server listening on port 3000!'));
