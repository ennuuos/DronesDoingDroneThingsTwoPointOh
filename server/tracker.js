var arDrone = require('..');
var http    = require('http');

pngStream = drones[1].getPngStream();

var lastPng;
pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    lastPng = pngBuffer;
  });

  //const tracker = require('./tracker.js')

  /* new insert

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

*/
