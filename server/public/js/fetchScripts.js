let list = {};
const fetchStatus = () => {
	fetch('/status')
	.then((resp) => resp.json())
	.then((data) => {
		for(var id in data) {
			if(!(id in list)) {
				list[id] = {'selected':false};
				list[id].element = document.createElement('div');
				document.body.appendChild(list[id].element);
				list[id].element.drone_id = id;
				list[id].element.addEventListener('click', function(e) {
					toggleSelect(event.target.drone_id);
				});
				// It works, you're wright. plzdonttuch
			}
			list[id].element.innerHTML = `ID: ${id} B: ${data[id].battery}%`;
		}
		for(var id in list) {
			if(!list.hasOwnProperty(id)) continue;
			if(!(id in data)) {
				document.body.removeChild(list[id].element);
				delete list[id];
			}
		}
	});
};
setInterval(fetchStatus, 1000);

const toggleSelect = (id) => {
	console.log(id);
	list[id].element.classList.toggle('selected');
	list[id].selected = !list[id].selected;
}

const sendCommand = (command) => {
	for(var i in list) {
		console.log(i);
		if(list[i].selected) fetch(`/control/${i}/${command}`);
	}
}

fetchStatus();
