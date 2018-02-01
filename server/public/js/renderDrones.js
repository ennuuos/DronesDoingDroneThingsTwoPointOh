
let drone_elements = {};

const render = function() {
	addElements();
	removeElements();
	updateElements();
}

const addElements = function() {
	for(let id in drone_data) {
		if(!(id in drone_elements)) addElement(id);
	}
}

const addElement = function(id) {
	drone_elements[id] = document.createElement('div');
	document.getElementById('selection_div').appendChild(drone_elements[id]);
	drone_elements[id].id = id;

	drone_elements[id].addEventListener('click',
		function(event) {
			toggleSelect(event.target.id);
	});
}

const removeElements = function() {
	for(let id in drone_elements) {
		if(!(id in drone_data)) removeElement(id);
	}
}
const removeElement = function(id) {
	console.log(id);
	document.getElementById('selection_div').removeChild(drone_elements[id]);
	delete drone_elements[id];
}

const updateElements = function() {
	for(let id in drone_elements) {
		drone_elements[id].innerHTML = elementTemplate(drone_elements[id].id);
	}
}

const elementTemplate = function(id) {
	return `
		ID: ${id}
		<br>
		B: ${drone_data[id].batteryPercentage}%
	`;
}


setInterval(render, 100);
