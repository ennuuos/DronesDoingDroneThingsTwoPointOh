const config = require('../../config.json');

console.log("Loaded Drone Wars game");

const defaultStartingScore = 0;
const defaultStartingLastPhotoTime = 0;
const photoCoolDownTime = 5000; //ms
const droneGameStatuses = {};
const pendingImages = [];
const yesPoints = 1;
const noPoints = -1;

const handleImage = containsDrone => {
    droneGameStatuses[endingImages.shift().droneId].score +=
        containsDrone ? yesPoints : noPoints;
}

module.exports = (app, drones) => {
    // Setup the game routes.

    app.post('/game/:id', (request, response) => {
        if (!drones.list.hasOwnProperty(request.params.id)) {
            response.status(400).send('Bad Request');
            return;
        }

        // If json contains default values, use those.
        droneGameStatuses[request.params.id] = {
            score: request.body.score | defaultStartingScore,
            lastPhotoTime:
                request.body.lastPhotoTime | defaultStartingLastPhotoTime,
        };
        response.status(200).send('OK');
    });

    app.delete('/game/:id', (request, response) => {
        if (droneGameStatuses.hasOwnProperty(request.params.id)) {
            delete droneGameStatuses[request.params.id];
            response.status(200).send('OK');
        } else {
            response.status(400).send('Bad Request');
        }
    });

    app.get('/game/scores', (request, response) => {
        const scores = {};
        for (droneId in droneGameStatuses) {
            scores[droneId] = droneGameStatuses[droneId].score;
        }
        response.send(scores);
    });

    app.post('/game/:id/action5', (request, response) => {
        if (!droneGameStatuses.hasOwnProperty(request.params.id)) {
            response.status(400).send('Bad Request');
            return;
        }

        const now = new Date();
        if (now - droneGameStatuses[id].lastPhotoTime < photoCoolDownTime) {
            response.status(200).send('OK');
            return;
        }
        droneGameStatuses[id].lastPhotoTime = now;

        pendingImages.push({droneId: id, image: drones.images[id]});
    })

    app.get('/game/referee', (request, response) => {
        // Serve the referee page.
    });

    app.post('/game/referee/yes', () => {handleImage(true)});
    app.post('/game/referee/no', () => {handleImage(false)});

	app.get('/game/referee/next_image.png', (request, response) => {
        if (pendingImages.length <= 0) {
            response.status(204).send('No Content');
            return;
        }

        const imagePath = path.join(
            __dirname, config.games_directory, 'config.game, `next_image.png`'
        );
        drones.vision.savePng(imagePath, pendingImages[0])
		response.sendFile(imagePath);
	});
};
