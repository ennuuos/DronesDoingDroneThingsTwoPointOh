const updateImage = () => {
    const imageToBeRefereedUrl = '/game/referee/next_image.png';
    const imageToBeRefereed = document.getElementById('image-to-be-refereed');

    fetch(imageToBeRefereedUrl)
        .then(function(response) {return response.blob();})
        .then(function(blob) {
            imageToBeRefereed.src = URL.createObjectURL(blob);
        });
}

const sendContainsDrone = containsDrone => {
    fetch('/game/referee/' + (containsDrone ? 'yes': 'no'), { method: 'POST'})
    updateImage();
};

setInterval(updateImage, 500);
