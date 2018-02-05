makeCamera = function(id) {
  cameras[id] = drones.drones[id].getPngStream();
  console.log('Camera for drone ' + id + ' created');
}


getPng = function(cameras) {
  console.log('getPng Running');
  for(i in cameras) {

    var lastPng;
    cameras[i]
      .on('error', console.log)
      .on('data', function(pngBuffer) {
        lastPng = pngBuffer;

        var frameCounter = 0;
        var saveDir = '/home/aedus/Projects/DronesDoingDroneThingsTwoPointOh/Images';
        var fs = require('fs');

        cameras[i]
          .on('error', console.log)
          .on('data', function(pngBuffer) {

          var imageName = saveDir + '/drone'+ i + '.png';
          fs. writeFile(imageName, pngBuffer, function(err) {
            if (err) {
              console.log('Buffer Error: Error saving PNG: ' + err);
            }
          console.log(imageName);
          });

          frameCounter++;
        });
      });
  }
};

module.exports = {
  makeCamera: makeCamera,
  getPng: getPng,
};
