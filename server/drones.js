const arDrone   = require('ar-drone')
const ping			= require('ping');

const addrPrefix = '192.168.1.10';
const speed = 0.2;

let list = {};

const pingDrone = (id) => {
  let addr = address(id);

  ping.sys.probe(addr, (success) => {
      if(success) create(id);
      if(!success) remove(id);
  }, {'timeout': 1});
};

const pingAll = () => {
  for(id = 0; id < 10; id++) {
    //pingDrone(id);
  }
}

const address = (id) => addrPrefix + id;

const create = (id) => {
  if(id in list) return;
  console.log(`Drone ${id} connected`);
  list[id] = {'battery':0};
  list[id].drone = arDrone.createClient({ip: address(id)});
  list[id].drone.animateLeds('redSnake', 5, 2);
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

//TEMP
create(1);
create(2);
setInterval(()=>{list[1]['battery']+=10}, 1500);
//TEMP


module.exports = {
  list: list,
  control: control,
  status: status,
};
