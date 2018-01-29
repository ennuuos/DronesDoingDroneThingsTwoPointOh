var canvas = document.getElementById("canvas");

function drawImageFromWebUrl(source){
  var img = new Image();

/* Draw an image from a url */

  img.addEventListener("load", function () {
    canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
  });

  img. setAttribute("src", source);
}

function FindMarker(droneImage){

}
