let drone_data = {};

let log_data = false;

const fetchData = function() {
	fetch('/status')
	.then(res => res.json())
	.then(data => {
		drone_data = data;
		if(log_data) console.log(drone_data);
	}).catch(err => console.log(err));
}

const sendCommand = function(command, degree) {
	for(let id in drones_selected) {
		let url = `/control/${id}/${command}`;
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({degree: degree}),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		});
	}
}

setInterval(fetchData, 1000 / 15);
