const deleteCamera = function(id) {
  delete pngStreams[id];
  videoStreams[id] = drones[id].getVideoStream();
  console.log('Cameras for drone ' + id + ' created');
}

const getPng = function(id) {
  console.log('getting Png');

    pngStreams[id]
      .on('error', console.log)
      .on('data', function(pngBuffer) {
        images[id] = pngBuffer;
      });
     }


const savePng = (path, picture) => {
    var fs = require('fs');
    return new Promise((resolve, reject) => {
        fs.writeFile(path, picture, function(err) {
            if (err) {
                reject('fs threw an error');
                throw err;
            }
            resolve()
        });
    })
}

module.exports = {
  deleteCamera: deleteCamera,
  getPng: getPng,
  savePng: savePng,
};
