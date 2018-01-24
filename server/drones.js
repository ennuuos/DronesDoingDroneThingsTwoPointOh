const arDrone   = require('ar-drone')
const ping			= require('ping');

const addrPrefix = '192.168.1.10';
const speed = 0.2;

let list = {};
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
    //DEBUG Turn off for debug
    pingDrone(id);
  }
}

const address = (id) => addrPrefix + id;
for(let i = 0; i < 10; i++) {
	drones[i] = arDrone.createClient({ip: address(i)});
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

const control = (id, action) => {
  if(!(id in list)) return;
  switch(action) {
    case 'stop':
      list[id].drone.stop();
      break;
    case 'takeoff':
      list[id].drone.takeoff()
      break;
    case 'land':
      list[id].drone.land();
      break;
    case 'left':
      list[id].drone.left(speed);
      break;
    case 'right':
      list[id].drone.right(speed);
      break;
    case 'front':
      list[id].drone.front(speed);
      break;
    case 'back':
      list[id].drone.back(speed);
      break;
    case 'counter':
      list[id].drone.counterClockwise(speed);
      break;
    case 'clockwise':
      list[id].drone.clockwise(speed);
      break;
  }
};

const status = () => {
  let status = {};
  for(var id in list) {
    status[id] = {'online': true};
    status[id]['battery'] = list[id]['battery'];
  }
  return status;
};

setInterval(pingAll, 1000);

//DEBUG add for debug
 // create(1);
 // create(3);
 //
 // setInterval(()=>{list[1]['battery']+=1}, 1000);
 // setTimeout(()=>{ create(2)}, 3000);
 // setTimeout(()=>{ remove(3)}, 5000);

//DEBUG add for debug


module.exports = {
  list: list,
  control: control,
  status: status,
};
