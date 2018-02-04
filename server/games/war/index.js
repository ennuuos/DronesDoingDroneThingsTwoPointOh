console.log("Loaded Drone Wars game");

const defaultScore = 0;
const defaultInEmergencyModeValue = false;
const emergencyModeControlStateName = 'CTRL_DEFAULT';
// The keys are the drones' IDs, the values are objects containing
// their score and whether or not they are currently in emergency
// mode.
const droneGameStatuses = {};

const updateStatusFromNavdata = (droneID, navdata) => {
    const newInEmergencyModeValue = navdata.controlState ==
        emergencyModeControlStateName;
    entredEmergencyMode = newInEmergencyModeValue &&
        !droneGameStatuses.inEmergecyMode;
    droneGameStatus.inEmergecyMode = newInEmergencyModeValue;

    if (entredEmergencyMode) {
        for (droneID in droneGameStatuses) {
            if (!droneGameStatuses[droneID].inEmergecyMode) {
                // If this drone entred emergency mode since the last check,
                // every other drone that isn't currently in emergency mode gets
                // points.
                droneGameStatuses[droneID].score += 1;
            }
        }
    }
}

module.exports = (app, drones) => {
    // Setup the game routes.

    app.post('/game/:id', (request, response) => {
        // If json containing a value for score or whether it is currently in
        // emergency mode is posted, store those values.
        const score = req.body.score | defaultScore;
        const inEmergencyMode = req.body.inEmergencyMode |
            defaultInEmergencyModeValue;
        droneScores[request.params.id] = {
            score: score,
            inEmergencyMode: inEmergencyMode
        };
        response.status(200).send('OK');
    })

    app.delete('/game/:id', (request, response) => {
        const id = request.params.id;
        if (droneScores.hasOwnProperty(id)) {
            delete droneScores.id;
            response.status(200).send('OK');
        } else {
            response.status(400).send('Bad Request');
        }
    })

    app.get('/game/scores', (request, response) => {
        const scores = {};
        for (droneID in droneGameStatuses) {
            scores[droneID] = droneGameStatuses[droneID].score;
        }
        response.send(scores);
    })

    // Set updateStatusFromNavdata to actually be called when navdata is ready.
    drones.gameNavdataCallback = updateStatusFromNavdata;
}
