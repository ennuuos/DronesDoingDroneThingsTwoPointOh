const arDrone = require('ar-drone')
const ping = require('ping');
let config = require('./config.json');
let clientCommands = require('./clientCommands.json')

const addrPrefix = config.network.ip_base;

let list = {};
let navdata = {};
let drones = {};

const pingDrone = (id) => {
  let addr = address(id);

  ping.sys.probe(addr, (success) => {
      if(success) create(id);
      if(!success) remove(id);
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
		//drones[i].on('navdata', console.log);
}

const create = (id) => {
    if(id in list) return;
    console.log(`Drone ${id} connected`);
    list[id] = {'battery':0};
    list[id].drone = drones[id];
    list[id].drone.animateLeds('blinkOrange', 5, 2);
};

const remove = (id) => {
    if(!(id in list)) return;
    console.log(`Drone ${id} disconnected`);
    delete list[id];
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
      list[id].drone.animateLeds('blinkGreenRed', 60, 2);
    } else if (actionsWithoutDegree.indexOf(action) > -1) {
        list[id].drone[action]();
    } else if (actionsWithDegree.indexOf(action) > -1) {
        list[id].drone[action](degree);
    } else {
        return false;
    }

    return true;
};

const status = () => {
    let status = {};
    for(var id in list) {
        status[id] = {'online': true};
        status[id]['battery'] = list[id].drone.battery();
    }
    return status;
};

if(!config.debug.no_ping) setInterval(pingAll, 1000);

if(config.debug.fake_drones) {
    create(1);
    create(3);
    setInterval(()=>{list[1]['battery']+=1}, 1000);
    setTimeout(()=>{ create(2)}, 3000);
    setTimeout(()=>{ remove(3)}, 5000);
}

module.exports = {
    list: list,
    control: control,
    status: status,
};
