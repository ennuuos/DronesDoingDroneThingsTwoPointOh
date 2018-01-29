// File largely taken from:
// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API


// Always uses the first gamepad, and always flys drone 2.
const gamepadID = 0
const droneToControlID = 2;
const gamepads = {};

// The analogue sticks have a lot of noise (even when not being touched), so we
// can round them to one decimal place to give them fewer distinct states.
const roundToNearestFifth = value => {
    return Math.round(value * 5) / 5;
}
const getValueFromZeroToOne = value => Math.min(1, Math.max(value, 0));
const getValueFromMinusOneToZero = value => Math.min(0, Math.max(value, -1));

const getGetButtonInputFunction = (buttonIndex) => {
    return () => {
        if (!gamepads[gamepadID]) {return false};
        return gamepads[gamepadID].buttons[buttonIndex].pressed;
    }
}
const getGetAxesInputFunction = (axisIndex, positivePart) => {
    if (positivePart) {
        return () => {
            if (!gamepads[gamepadID]) {return 0};
            return getValueFromZeroToOne(roundToNearestFifth(
                gamepads[gamepadID].axes[axisIndex]
            ));
        }
    } else {
        return () => {
            if (!gamepads[gamepadID])  {return 0};
            return Math.abs(getValueFromMinusOneToZero(roundToNearestFifth(
                gamepads[gamepadID].axes[axisIndex]
            )));
        }
    }
}

// Arbitrary mapping for now. A more consistent way should be found.
const actionValueFunctions = {
    'left': getGetAxesInputFunction(0, false),
    'right': getGetAxesInputFunction(0, true),
    'front': getGetAxesInputFunction(1, false),
    'back': getGetAxesInputFunction(1, true),
    'counterClockwise': getGetAxesInputFunction(2, false),
    'clockwise': getGetAxesInputFunction(2, true),
    'up': getGetAxesInputFunction(3, false),
    'down': getGetAxesInputFunction(3, true),
    'takeoff': getGetButtonInputFunction(0),
    'land': getGetButtonInputFunction(1),
    'stop': getGetButtonInputFunction(2)
}

var thereAreEvents = 'ongamepadconnected' in window;

// Yes, I know, redundancy.

function gamepadConnectionHandler(event) {
    addGamepad(event.gamepad);
}

function addGamepad(gamepad) {
    gamepads[gamepad.index] = gamepad;
}

function gamepadDisconnectionHandler(event) {
    removeGamepad(event.gamepad);
}

function removeGamepad(gamepad) {
    delete gamepads[gamepad.index];
}

function updateStatus() {
    if (!thereAreEvents) {
        scangamepads();
    }

    for (action in actionValueFunctions) {
        let url = `/control/${droneToControlID}/${action}`;
        let degree = actionValueFunctions[action]();
        if (degree) {
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({degree: degree}),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
        }
    }
}
updateStatus();
setInterval(updateStatus, 100);

function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            if (gamepads[i].index in gamepads) {
                gamepads[gamepads[i].index] = gamepads[i];
            } else {
                addGamepad(gamepads[i]);
            }
        }
    }
}

window.addEventListener('gamepadconnected', gamepadConnectionHandler);
window.addEventListener('gamepaddisconnected', gamepadDisconnectionHandler);

if (!thereAreEvents) {
  setInterval(scangamepads, 500);
}
