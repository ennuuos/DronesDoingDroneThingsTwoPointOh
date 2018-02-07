// This file takes the commands from connected gamepads and decides from them
// what control commands to send to the server.

const gamepadAxisThreshold = 0.03;
const gamepads = {};
const gamepadDroneIds = {};
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
    return gamepadId => {
        if (!gamepads[gamepadId]) {return false};
        return gamepads[gamepadId].buttons[buttonIndex].pressed;
    }
}
const getGetAxesInputFunction = (axisIndex, positivePart) => {
    // positivePart determines whether the input should be taken from the
    // positive of negative part of the axis value.
    const direction = positivePart ? 1 : -1;
    return gamepadId => {
        if (!gamepads[gamepadId]) return false;
        return constrainValue(
            gamepads[gamepadId].axes[axisIndex],
            gamepadAxisThreshold * direction,
            direction
        );
    }
}

const getGetStandardUrlFunction = action => id => `control/${id}/${action}`;

// This maps each of the commands to their controller input function, and
// whether they need to be stopped when they are not being sent. Stop gets
// mapped on its own, as it is used separately later.
const stopMapping = { // X.
    getUrl: getGetStandardUrlFunction('stop'),
    getInput: getGetButtonInputFunction(2),
    sendStopAfter: false,
}
const controllerMappings = [
    // Drone control actions.
    { // Left stick left.
        getUrl: getGetStandardUrlFunction('left'),
        getInput: getGetAxesInputFunction(0, false),
        sendStopAfter: true,
    },
    { // Left stick right.
        getUrl: getGetStandardUrlFunction('right'),
        getInput: getGetAxesInputFunction(0, true),
        sendStopAfter: true,
    },
    { // Left stick forwards.
        getUrl: getGetStandardUrlFunction('front'),
        getInput: getGetAxesInputFunction(1, false),
        sendStopAfter: true,
    },
    { // Left stick backwards.
        getUrl: getGetStandardUrlFunction('back'),
        getInput: getGetAxesInputFunction(1, true),
        sendStopAfter: true,
    },
    { // Right stick left.
        getUrl: getGetStandardUrlFunction('counterClockwise'),
        getInput: getGetAxesInputFunction(3, false),
        sendStopAfter: true,
    },
    { // Right stick right.
        getUrl: getGetStandardUrlFunction('clockwise'),
        getInput: getGetAxesInputFunction(3, true),
        sendStopAfter: true,
    },
    { // Right stick forwards.
        getUrl: getGetStandardUrlFunction('up'),
        getInput: getGetAxesInputFunction(4, false),
        sendStopAfter: true,
    },
    { // Right stick backwards.
        getUrl: getGetStandardUrlFunction('down'),
        getInput: getGetAxesInputFunction(4, true),
        sendStopAfter: true,
    },
    { // A.
        getUrl: getGetStandardUrlFunction('takeoff'),
        getInput: getGetButtonInputFunction(0),
        sendStopAfter: false,
    },
    { // B.
        getUrl: getGetStandardUrlFunction('land'),
        getInput: getGetButtonInputFunction(1),
        sendStopAfter: false,
    },
    stopMapping, // X.
	{ // Y.
        getUrl: getGetStandardUrlFunction('lights'),
		getInput: getGetButtonInputFunction(3),
		sendStopAfter: false,
	},
    // Game actions.
    { // D pad up.
        getUrl: id => `/game/${id}/action0`,
        getInput: getGetAxesInputFunction(7, false),
        sendStopAfter: false,
    },
    { // D pad down.
        getUrl: id => `/game/${id}/action1`,
        getInput: getGetAxesInputFunction(7, true),
        sendStopAfter: false,
    },
    { // D pad left.
        getUrl: id => `/game/${id}/action2`,
        getInput: getGetAxesInputFunction(6, false),
        sendStopAfter: false,
    },
    { // D pad right.
        getUrl: id => `/game/${id}/action3`,
        getInput: getGetAxesInputFunction(6, true),
        sendStopAfter: false,
    },
    { // Left bumper.
        getUrl: id => `/game/${id}/action4`,
        getInput: getGetButtonInputFunction(4),
        sendStopAfter: false,
    },
    { // Right bumper.
        getUrl: id => `/game/${id}/action5`,
        getInput: getGetButtonInputFunction(5),
        sendStopAfter: false,
    },
];

const sendControls = () => {
    for (gamepadId in gamepads) {
        // For each of the gamepads we need to work out what their commands are,
        // and then send them to each of the drones assigned to that gamepad.
        // This includes sending a stop command if last update the gamepad had
        // sent an analog command but this update it didn't.

        const commands = controllerMappings
            .map(mapping => {return {
                urls: gamepadDroneIds[gamepadId].map(
                    droneId => mapping.getUrl(droneId)
                ),
                degree: mapping.getInput(gamepadId),
                sendStopAfter: mapping.sendStopAfter
            }})
            .filter(command => command.degree)
        const sentStopAfterCommandThisTime = commands.some(
            command => command.sendStopAfter
        );

        if (
            gamepads[gamepadId].sentStopAfterCommandLastTime &&
                !sentStopAfterCommandThisTime
        ) {
            // If we sent a stop after command last time, but not this time,
            // add a stop command to the list of commands.
            commands.push({
                urls: gamepadDroneIds[gamepadId].map(
                    droneId => stopMapping.getUrl(droneId)
                ),
                degree: 1,
            })
        }
        gamepads[gamepadId].sentStopAfterCommandLastTime =
            sentStopAfterCommandThisTime;

        commands.forEach(command => {
            command.urls.forEach(url => {
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({degree: command.degree}),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
            })
        })
    }
}

const addGamepad = (gamepad) => {
    gamepad.sentStopAfterCommandLastTime = false;
    // (^) For recording whether we need to tell the drones connected to that
    // controller to stop after we stop sending an analog signal
    gamepads[gamepad.index] = gamepad;
		gamepadDroneIds[gamepad.index] = [];
		createGamepadElement(gamepad.index);
}

const removeGamepad = (gamepad) => {
    delete gamepads[gamepad.index];
}

sendControls();
setInterval(sendControls, 100);

window.addEventListener(
    'gamepadconnected', event => addGamepad(event.gamepad)
);
window.addEventListener(
    'gamepaddisconnected', event => removeGamepad(event.gamepad)
);
