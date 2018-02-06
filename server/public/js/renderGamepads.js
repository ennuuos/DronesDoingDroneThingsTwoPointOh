let gamepad_elements = {};
let gamepads_selected = {};

const renderGamepads = function() {
	addGamepadElements();
	updateGamepadElements();
}

const addGamepadElements = function() {
	let gamepad_div = document.getElementById('gamepad_div');
	for(let id in gamepads) {
		if(!(id in gamepad_elements)) {
			createGamepadElement(id);
		}
	}
}

const createGamepadElement = function(id) {
	let gamepad_div = document.getElementById('gamepad_div');
	gamepad_elements[id] = document.createElement('div');
	gamepad_div.appendChild(gamepad_elements[id]);
	gamepad_elements[id].id = id; //ID

	gamepad_elements[id].addEventListener('click',
		function(event) {
			toggleSelectGamepad(event.target.id);
	});
}



const toggleSelectGamepad = function(id) {
	gamepad_elements[id].classList.toggle('selected');
	if(id in gamepads_selected) {
		delete gamepads_selected[id];
	} else {
		gamepads_selected[id] = true;
	}
}

const updateGamepadElements = function() {
	for(let id in gamepad_elements) {
		gamepad_elements[id].innerHTML = gamepadElementTemplate(id);
	}
}

const gamepadElementTemplate = function(id) {
	return `
		Gamepad ${id}
		<br>
		${gamepadDroneIds[id]}
	`;
}

const bindGamepads = function() {
	console.log(gamepads_selected);
	console.log(drones_selected);
	console.log(gamepadDroneIds);
	for(let g_id in gamepads_selected) {
		let d_list = [];
		for(let d_id in drones_selected) {
			d_list.push(d_id);
		}
		gamepadDroneIds[g_id] = d_list;
	}
}


setInterval(renderGamepads, 100);
