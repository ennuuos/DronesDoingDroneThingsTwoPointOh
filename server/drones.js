const arDrone = require('ar-drone')
const ping = require('ping');

let config = require('./config.json');
let clientCommands = require('./clientCommands.json')

const addrPrefix = config.network.ip_base;

let list = {};
let navdata = {};
let drones = {};
var pngStreams = {};
var videoStreams = {};
var images = {};

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
      if(config.game === 'photo') {
            pngStreams[i] = drones[i].getPngStream()
                //.on('error', console.log)
                .on('data', pngBuffer => {images[i] = pngBuffer})
            videoStreams[i] = drones[i].getVideoStream();
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
    videoStreams: videoStreams,
    images: images,
}
