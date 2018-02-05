console.log("Loaded Drone Wars game");

const defaultScore = 0;
const defaultInEmergencyModeValue = false;
const emergencyModeControlStateName = 'CTRL_DEFAULT';
// The keys are the drones' IDs, the values are objects containing
// their score and whether or not they are currently in emergency
// mode.
const droneGameStatuses = {};

const updateStatusFromNavdata = (droneId, navdata) => {
    const newInEmergencyModeValue =
        navdata.controlState == emergencyModeControlStateName;
    let enteredEmergencyMode =
        newInEmergencyModeValue && !droneGameStatuses[droneId].inEmergencyMode;
    droneGameStatuses[droneId].inEmergencyMode = newInEmergencyModeValue;
    if (enteredEmergencyMode) {
        for (droneId in droneGameStatuses) {
            if (!droneGameStatuses[droneId].inEmergencyMode) {
                // If this drone entred emergency mode since; the last check,
                // every other drone that isn't currently in emergency mode gets
                // points.
                droneGameStatuses[droneId].score += 1;
            }
        }
    }
}

module.exports = (app, drones) => {
    // Setup the game routes.

    app.post('/game/:id', (request, response) => {
        // If json containing a value for score or whether it is currently in
        // emergency mode is posted, store those values.
        const score = request.body.score | defaultScore;
        const inEmergencyMode = request.body.inEmergencyMode |
            defaultInEmergencyModeValue;
        droneGameStatuses[request.params.id] = {
            score: score,
            inEmergencyMode: inEmergencyMode
        };
        drones.list[request.params.id].on('navdata', (data) => {
            if(data.demo) {
                updateStatusFromNavdata(request.params.id, data.demo);
            }
        });
        response.status(200).send('OK');
    });

    app.delete('/game/:id', (request, response) => {
        const id = request.params.id;
        if (droneGameStatuses.hasOwnProperty(id)) {
            delete droneGameStatuses[id];
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
};
