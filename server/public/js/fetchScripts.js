// A list containing the selected status of any connected drones, and their
// corresponding html display elements:
let droneStatusList = {};

const fetchStatus = () => {
	// Gets the status of the connected drones from the server.

	fetch('/status')
	.then((response) => response.json())
	.then((serverDroneData) => {
		for(var id in serverDroneData) {
			// For each of the drones the server says are connected, if they are
			// not already in the client's list, add them.

			if(!(id in droneStatusList)) {
				droneStatusList[id] = {'selected':false};
				droneStatusList[id].element = document.createElement('div');
				document.getElementById("selection_div").appendChild(
					droneStatusList[id].element
				);
				droneStatusList[id].element.drone_id = id;

				droneStatusList[id].element.addEventListener('click',
					function(event) {
						toggleSelect(event.target.drone_id);
				});
			}
			droneStatusList[id].element.innerHTML =
				`ID: ${id}<br>B: ${serverDroneData[id].battery}%`;
		}

		for(var id in droneStatusList) {
			// If the client's list has any drones not on the server's list,
			// remove them.

			if(!droneStatusList.hasOwnProperty(id)) continue;

			if(!(id in serverDroneData)) {
				document.getElementById("selection_div").removeChild(
					droneStatusList[id].element
				);
				delete droneStatusList[id];
			}
		}
	}).catch({

	});
};

setInterval(fetchStatus, 1000);

const toggleSelect = (id) => {
	droneStatusList[id].element.classList.toggle('selected');
	droneStatusList[id].selected = !droneStatusList[id].selected;
}

const sendCommand = (command, degree) => {
	for(var id in droneStatusList) {
		if(droneStatusList[id].selected) {
			let url = `/control/${id}/${command}`;
			console.log(url);
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

fetchStatus();
