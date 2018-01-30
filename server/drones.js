const arDrone = require('ar-drone')
const ping = require('ping');

let config = require('./config.json');
let clientCommands = require('./clientCommands.json')

const addrPrefix = config.network.ip_base;

let list = {};
let navdata = {};
let drones = {};

let gameNavdataCallback = () => {};

const pingDrone = (id) => {
  let addr = address(id);

  ping.sys.probe(addr, (success) => {
      // if(success) create(id);
      // if(!success) remove(id);
      (success ? create : remove)(id);
  }, {'timeout': 1});
};

const pingAll = () => {
    for(id = 0; id < 10; id++) {
        pingDrone(id);
    }
}

const address = (id) => addrPrefix + id;
for(let i = 0; i < 10; i++) {
    drones[i] = arDrone.createClient({ip: address(i)});
		drones[i].on('navdata', (data) => {
			if(data.demo) {
				if(!navdata[i]) console.log(`Drone ${i} connected`);
				navdata[i] = data.demo;
			}
		});
}



const create = (id) => {
    if(id in list) return;
    list[id] = drones[id];
	drones[id].resume();
    list[id].animateLeds('blinkOrange', 5, 2);
};

const remove = (id) => {
    if(!(id in list)) return;
    console.log(`Drone ${id} disconnected`);
    delete list[id];
	if(navdata[id]) delete navdata[id];
};

const control = (id, action, degree) => {
    // Returns false if given an invalid command or degree, and true otherwise.
    if(!(id in list) || degree > 1 || degree < 0) return false;

    let actionsWithoutDegree = clientCommands
        .filter(command => !command['has_degree'])
        .map(command => command['action']);
    let actionsWithDegree = clientCommands
        .filter(command => command['has_degree'])
        .map(command => command['action']);

    if (action == "lights") {
      list[id].animateLeds('blinkGreenRed', 60, 2);
    } else if (actionsWithoutDegree.indexOf(action) > -1) {
        list[id][action]();
    } else if (actionsWithDegree.indexOf(action) > -1) {
        list[id][action](degree);
    } else {
        return false;
    }

    return true;
};

const status = () => {
    return navdata;
};

if(!config.debug.no_ping) setInterval(pingAll, 1000);

module.exports = {
    list: list,
    control: control,
    status: status,
    gameNavdataCallback: gameNavdataCallback,
};

var http    = require('http');

if(1 in drones) {
  pngStream = drones[1].getPngStream();

  var lastPng;
  pngStream
    .on('error', console.log)
    .on('data', function(pngBuffer) {
      lastPng = pngBuffer;

      var frameCounter = 0;
      var saveDir = '/home/Projects/DronesDoingDroneThingsTwoPointOh/Images';

      pngStream
        .on('error', console.log)
        .on('data', function(pngBuffer) {


        var imageName = saveDir + '/savePNG' + frameCounter +
      '.png';
        fs. writeFile(imageName, pngBuffer, function(err) {
          if (err) {
            console.log('Error saving PNG: ' + err);
          }
        });

        console.log(imageName);

        frameCounter++;
      });
    });
}
