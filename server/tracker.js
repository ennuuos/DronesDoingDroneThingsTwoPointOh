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

module.exports = {
  makeCamera: makeCamera,
  getPng: getPng,
  savePng: savePng,
};
