const drones_selected = {};

const toggleSelect = function(id) {
	drone_elements[id].classList.toggle('selected');
	if(id in drones_selected) {
		delete drones_selected[id];
	} else {
		drones_selected[id] = true;
	}
}
