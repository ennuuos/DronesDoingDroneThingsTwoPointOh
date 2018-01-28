// File largely taken from:
// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API


// Always uses the first gamepad, and always flys drone 2.
const gamepadToUseIndex = 0;
const droneToControlID = 2;
const gamepads = {};

// The analogue sticks have a lot of noise (even when not being touched), so we
// can round them to one decimal place to give them fewer distinct states.
const roundToOneDecimalPlace(value) => {
    return Number(Math.round(value + 'e1') + 'e-1');
}

const getGetInputFunction(gamepadIndex, inputIsAxis, inputIndex) => {
    if (inputIsAxis) {
        return () => roundToOneDecimalPlace(
            gamepads[gamepadIndex].axis[inputIndex]
        );
    } else {
        return () => roundToOneDecimalPlace(
            gamepads[gamepadIndex].buttons[inputIndex]
        );
    }
}

const getValueFromZeroToOne(value) => {

}

// Arbitrary mapping for now. A more consistent way should be found.
const actionValueFunctions = {

}

var thereAreEvents = 'ongamepadconnected' in window;

function gamepadConnectionHandler(event) {
    addGamepad(event.gamepad);
}

function addGamepad(gamepad) {
    gamepads[gamepad.index] = gamepad;

    var controllerDisplayDiv = document.createElement('div');
    controllerDisplayDiv.setAttribute('id', 'controller' + gamepad.index);

    var title = document.createElement('h1');
    title.appendChild(document.createTextNode('gamepad: ' + gamepad.id));
    controllerDisplayDiv.appendChild(title);

    var buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';
    for (var i = 0; i < gamepad.buttons.length; i++) {
        var buttonIDSpan = document.createElement('span');
        buttonIDSpan.className = 'button';
        //e.id = 'b' + i;
        buttonIDSpan.innerHTML = i;
        buttonsDiv.appendChild(buttonIDSpan);
    }

    controllerDisplayDiv.appendChild(buttonsDiv);

    var axesDiv = document.createElement('div');
    axesDiv.className = 'axes';

    for (var i = 0; i < gamepad.axes.length; i++) {
        var axisDisplay = document.createElement('progress');
        axisDisplay.className = 'axis';
        //p.id = 'a' + i;
        axisDisplay.setAttribute('max', '2');
        axisDisplay.setAttribute('value', '1');
        axisDisplay.innerHTML = i;
        axesDiv.appendChild(axisDisplay);
    }

    controllerDisplayDiv.appendChild(axesDiv);

    document.body.appendChild(controllerDisplayDiv);
    requestAnimationFrame(updateStatus);
}

function gamepadDisconnectionHandler(event) {
    removeGamepad(event.gamepad);
}

function removeGamepad(gamepad) {
    var d = document.getElementById('controller' + gamepad.index);
    document.body.removeChild(d);
    delete gamepads[gamepad.index];
}

function updateStatus() {
  if (!thereAreEvents) {
    scangamepads();
  }

  var i = 0;
  var j;

  for (j in gamepads) {
    var controller = gamepads[j];
    var d = document.getElementById('controller' + j);
    var buttons = d.getElementsByClassName('button');

    for (i = 0; i < controller.buttons.length; i++) {
      var b = buttons[i];
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == 'object') {
        pressed = val.pressed;
        val = val.value;
      }

      var pct = Math.round(val * 100) + '%';
      b.style.backgroundSize = pct + ' ' + pct;

      if (pressed) {
        b.className = 'button pressed';
      } else {
        b.className = 'button';
      }
    }

    var axes = d.getElementsByClassName('axis');
    for (i = 0; i < controller.axes.length; i++) {
      var a = axes[i];
      a.innerHTML = i + ': ' + controller.axes[i].toFixed(4);
      a.setAttribute('value', controller.axes[i] + 1);
    }
  }

  requestAnimationFrame(updateStatus);
}

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
