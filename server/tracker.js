makeCamera = function(id) {
  cameras[id] = drones[id].getPngStream();
  videoStreams[id] = drones[id].getVideoStream();
  console.log('Cameras for drone ' + id + ' created');
}

getPng = function(id) {
  console.log('getting Png');

    pngStreams[id]
      .on('error', console.log)
      .on('data', function(pngBuffer) {
        images[id] = pngBuffer;
      });
     }

savePng = function(path, picture) {
  var fs = require('fs');
  console.log('Saving Image');
  fs.writeFile(path, picture, function(err) {
    if (err) {
      console.log('Something fucked up: ' + err);
    };
  });
}

/*begin insert
var fs = require('fs');
var pngStream = drones[1].getPngStream();
var frameCounter = 0;
var saveDir = '/home/Projects/DronesDoingDroneThingsTwoPointOh/Images';

console.log('Inside PNGStream')

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

console.log('Leaving PNGStream');
end insert */

module.exports = {
  makeCamera: makeCamera,
  getPng: getPng,
};
