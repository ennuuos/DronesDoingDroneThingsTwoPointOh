const drones_selected = {};

const toggleSelect = function(id) {
	drones_selected[id] ? deselect(id) : select(id);
}

const select = function(id) {
	drone_elements[id].classList.add('selected');
	drones_selected[id] = true;
}
const deselect = function(id) {
	drone_elements[id].classList.remove('selected');
	if(drones_selected[id]) delete drones_selected[id];
}

const selectAll = function() {
	let sa_button = document.getElementById('selectAll_button');
	sa_button.innerHTML = "Deselect All";
	sa_button.onclick = deselectAll;
	for(let id in drone_elements) {
		drones_selected[id] = true;
		drone_elements[id].classList.add('selected');
	}
}
const deselectAll = function() {
	let sa_button = document.getElementById('selectAll_button');
	sa_button.innerHTML = "Select All";
	sa_button.onclick = selectAll;
	for(let id in drone_elements) {
		if(drones_selected[id]) delete drones_selected[id];
		drone_elements[id].classList.remove('selected');
	}
}

const checkSelectionButton = function() {
	let sa_button = document.getElementById('selectAll_button');
	sa_button.style.display = areThereDrones() ? 'block' : 'none';
}
