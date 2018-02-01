// This file takes the commands from connected gamepads and decides from them
// what control commands to send to the server.

const gamepadAxisThreshold = 0.01;
const gamepads = {};
const droneIDsControlledByGamepad = {0: [0], 1: [1]}
// Currently arbitrary (^), but will eventually be controlled by the user.

// The analogue sticks have a lot of noise (even when not being touched), so we
// need the below functions to threshold and scale the raw values they return.
const getValueFromZeroToOne = value => Math.min(1, Math.max(value, 0));
const constrainValue = (value, inputStart, inputEnd) => {
    // Returns a number between zero and one (inclusive) representing how far
    // value is from inputStart towards inputEnd.
    return getValueFromZeroToOne(
        (value - inputStart) / (inputEnd - inputStart)
    );
};

const getGetButtonInputFunction = (buttonIndex) => {
    return gamepadID => {
        if (!gamepads[gamepadID]) {return false};
        return gamepads[gamepadID].buttons[buttonIndex].pressed;
    }
}
const getGetAxesInputFunction = (axisIndex, positivePart) => {
    // positivePart determines whether the input should be taken from the
    // positive of negative part of the axis value.
    const direction = positivePart ? 1 : -1;
    return gamepadID => {
        if (!gamepads[gamepadID]) {return false};
        return constrainValue(
            gamepads[gamepadID].axes[axisIndex],
            gamepadAxisThreshold * direction,
            direction
        );
    }
}

// This maps each of the commands to their controller input function, and
// whether or not they are analog controlls (and hence need to be stopped when
// they are not being sent).
const controllerMappings = {
    left: {
        getInput: getGetAxesInputFunction(0, false),
        isAnalog: true,
    },
    right: {
        getInput: getGetAxesInputFunction(0, true),
        isAnalog: true,
    },
    front: {
        getInput: getGetAxesInputFunction(1, false),
        isAnalog: true,
    },
    back: {
        getInput: getGetAxesInputFunction(1, true),
        isAnalog: true,
    },
    counterClockwise: {
        getInput: getGetAxesInputFunction(3, false),
        isAnalog: true,
    },
    clockwise:  {
        getInput: getGetAxesInputFunction(3, true),
        isAnalog: true,
    },
    up: {
        getInput: getGetAxesInputFunction(4, false),
        isAnalog: true,
    },
    down: {
        getInput: getGetAxesInputFunction(4, true),
        isAnalog: true,
    },
    takeoff: {
        getInput: getGetButtonInputFunction(0),
        isAnalog: false,
    },
    land: {
        getInput: getGetButtonInputFunction(1),
        isAnalog: false,
    },
    stop: {
        getInput: getGetButtonInputFunction(2),
        isAnalog: false,
    }
}

const sendControls = () => {
    for (gamepadID in gamepads) {
        // For each of the gamepads we need to work out what their commands are,
        // and then send them to each of the drones assigned to that gamepad.
        // This includes sending a stop command if last update the gamepad had
        // sent an analog command but this update it didn't.
        const gamepad = gamepads[gamepadID];
        let sentAnalogCommandThisTime = false;

        // We work out the commands all together first to avoid different drones
        // getting different insturctions from the same gamepad.
        commandDegrees = {};
        for (command in controllerMappings) {
            const commandObject = controllerMappings[command];
            const degree = commandObject.getInput(gamepadID)

            if (degree) {
                commandDegrees[command] = degree;

                if (commandObject.isAnalog) {
                    sentAnalogCommandThisTime = true
                };
            }
        }

        if (gamepad.sentAnalogCommandLastTime && !sentAnalogCommandThisTime) {
            commandDegrees.stop = 1;
        }
        gamepad.sentAnalogCommandLastTime = sentAnalogCommandThisTime;

        for (droneID of droneIDsControlledByGamepad[gamepadID]) {
            for (command in commandDegrees) {
                const url = `/control/${droneID}/${command}`;
                // All the commands in commandDegrees had a non zero degree, so
                // we can go ahead and send them all.
                if (commandDegrees[command]) {
                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify({degree: commandDegrees[command]}),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    });
                }
            }
        }
    }
}

const addGamepad = (gamepad) => {
    gamepad.sentAnalogCommandLastTime = false;
    // (^) For recording whether we need to tell the drones connected to that
    // controller to stop after we stop sending an analog signal
    gamepads[gamepad.index] = gamepad;
}

const removeGamepad = (gamepad) => {
    delete gamepads[gamepad.index];
}

sendControls();
setInterval(sendControls, 100);

window.addEventListener('gamepadconnected', event => addGamepad(event.gamepad));
window.addEventListener(
    'gamepaddisconnected', event => removeGamepad(event.gamepad)
);
