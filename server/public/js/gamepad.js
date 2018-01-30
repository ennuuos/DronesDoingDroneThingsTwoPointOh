const gamepadAxisThreshold = 0.15;
const gamepads = {};
const dronesIDsControlledByGamepad = {0: [1, 3, 9]}; // Currently arbitrary.

// The analogue sticks have a lot of noise (even when not being touched), so we
// need the below functions to threshold and scale the raw values they return.
const getValueFromZeroToOne = value => Math.min(1, Math.max(value, 0));
const constrainValue = (value, inputStart, inputEnd) => {
    // Returns a number between zero and one (inclusive) representing how far
    // value is from inputStart towards inputEnd.
    const displacementOfInputEndFromInputStart = inputEnd - inputStart;
    const displacementOfValueFromInputStart = value - inputStart;
    const decimalDisplacement = displacementOfValueFromInputStart /
        displacementOfInputEndFromInputStart;
    const constrainedValue = getValueFromZeroToOne(decimalDisplacement);
    return constrainedValue;
};

const getGetButtonInputFunction = (buttonIndex) => {
    return gamepadID => {
        if (!gamepads[gamepadID]) {return false};
        return gamepads[gamepadID].buttons[buttonIndex].pressed;
    }
}
const getGetAxesInputFunction = (axisIndex, positivePart) => {
    const direction = positivePart ? 1 : -1;
    return gamepadID => constrainValue(
            gamepads[gamepadID].axes[axisIndex],
            gamepadAxisThreshold * direction,
            direction
    );
}

// Arbitrary mapping for now. A more consistent way should be found.
const actionData = {
    'left': {
        'getInput': getGetAxesInputFunction(0, false),
        'isAnalog': true,
    },
    'right': {
        'getInput': getGetAxesInputFunction(0, true),
        'isAnalog': true,
    },
    'front': {
        'getInput': getGetAxesInputFunction(1, false),
        'isAnalog': true,
    },
    'back': {
        'getInput': getGetAxesInputFunction(1, true),
        'isAnalog': true,
    },
    'counterClockwise': {
        'getInput': getGetAxesInputFunction(2, false),
        'isAnalog': true,
    },
    'clockwise':  {
        'getInput': getGetAxesInputFunction(2, true),
        'isAnalog': true,
    },
    'up': {
        'getInput': getGetAxesInputFunction(3, false),
        'isAnalog': true,
    },
    'down': {
        'getInput': getGetAxesInputFunction(3, true),
        'isAnalog': true,
    },
    'takeoff': {
        'getInput': getGetButtonInputFunction(0),
        'isAnalog': false,
    },
    'land': {
        'getInput': getGetButtonInputFunction(1),
        'isAnalog': false,
    },
    'stop': {
        'getInput': getGetButtonInputFunction(2),
        'isAnalog': false,
    }
}

function addGamepad(gamepad) {
    gamepad.sentAnalogCommandLastTime = false;
    gamepads[gamepad.index] = gamepad;
}

function removeGamepad(gamepad) {
    delete gamepads[gamepad.index];
}

function scangamepads() {
    var currentGamepads = navigator.getGamepads ? navigator.getGamepads() : (
        navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []
    );
    for (var i = 0; i < currentGamepads.length; i++) {
        if (currentGamepads[i]) {
            if (currentGamepads[i].index in currentGamepads) {
                currentGamepads[currentGamepads[i].index] = currentGamepads[i];
            } else {
                addGamepad(currentGamepads[i]);
            }
        }
    }
}

function updateStatus() {
    if (!thereAreEvents) {
        scangamepads();
    }

    for (gamepadID in gamepads) {
        let sentAnalogCommand = false;
        let actionsToTake = actionData.;
        for (action in actionData) {
            actionDegrees[action] = actionData[action].getInput(gamepadID);
        }

        for (droneID of dronesIDsControlledByGamepad[gamepadID]) {
            for (action in actionData) {
                let url = `/control/${droneID}/${action}`;
                let degree = actionData[action].getInput(gamepadID);

                if (degree) {
                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify({degree: degree}),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    });
                }

                if (actionData[action].isAnalog) {sentAnalogCommand = true};
            }

            console.log(gamepads[gamepadID].sentAnalogCommandLastTime, sentAnalogCommand);

            if (
                gamepads[gamepadID].sentAnalogCommandLastTime &&
                    !sentAnalogCommand
            ) {
                // If we sent an analog command last time, but not this time,
                // we need to tell the drone to stop. We can do this for every
                // drone this controller is connected to, because they will have
                // all been recieving the same commands.
                const stopURL = `/control/${droneID}/stop`
                // I don't like that (^) either.
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({degree: 1}),
                    headers: new Headers({'Content-Type': 'application/json'})
                });
                // Or that (^).
            }
        }

        gamepads[gamepadID].sentAnalogCommandLastTime = sentAnalogCommand;
    }
}

let thereAreEvents = 'ongamepadconnected' in window;
updateStatus();
setInterval(updateStatus, 100);

window.addEventListener('gamepadconnected', event => addGamepad(event.gamepad));
window.addEventListener(
    'gamepaddisconnected', event => removeGamepad(event.gamepad)
);
