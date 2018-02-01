
let drone_elements = {};

const areThereDrones = function() {
		for(let k in drone_elements) {
			if(drone_elements.hasOwnProperty(k)) return true;
		}
		return false;
}

const renderDrones = function() {
	addElements();
	removeElements();
	updateElements();
	checkSelectionButton();
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
		// if(drone_data[id].controlState === "CTRL_DEFAULT") {
		// 	drone_elements[id].classList.add('emergency');
		// } else {
		// 	drone_elements[id].classList.remove('emergency');
		// }
		drone_elements[id].classList[drone_data[id].controlState === "CTRL_DEFAULT"?'add':'remove']('emergency');
	}
}

const elementTemplate = function(id) {
	return `
		ID: ${id}
		<br>
		B: ${drone_data[id].batteryPercentage}%
	`;
}


setInterval(renderDrones, 100);
