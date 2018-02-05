console.log("Loaded Drone Wars game");

const defaultStartingScore = 0;
const scores = {};
const pendingImages = [];

module.exports = (app, drones) => {
    // Setup the game routes.

    app.post('/game/:id', (request, response) => {
        // If json containing a value for score is posted, start with that.
        const score = request.body.score | defaultStartingScore;

        if (!drones.list.hasOwnProperty(request.params.id)) {
            response.status(400).send('Bad Request');
            return;
        }

        scores[request.params.id] = {score: score};
        response.status(200).send('OK');
    });

    app.delete('/game/:id', (request, response) => {
        if (scores.hasOwnProperty(request.params.id)) {
            delete scores[request.params.id];
            response.status(200).send('OK');
        } else {
            response.status(400).send('Bad Request');
        }
    });

    app.get('/game/scores', (request, response) => {
        response.send(scores);
    });

    app.post('/control/:id/gameAction', (request, response) => {
        // "Take a photo".
        // Adds the png
    })
};
