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



module.exports = {
  makeCamera: makeCamera,
  getPng: getPng,
};
