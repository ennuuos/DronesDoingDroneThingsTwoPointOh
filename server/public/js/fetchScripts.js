let list = {};
const fetchStatus = () => {
  fetch('/status')
  .then((resp) => resp.json())
  .then((data) => {
    for(var id in data) {
      if(!(id in list)) {
        list[id] = {'selected':false};
        list[id].element = document.createElement("div");
        document.body.appendChild(list[id].element);
        //BIND BUTTON
      }
      list[id].element.innerHTML = `ID: ${id} B: ${data[id].battery}%`;
    }
  });
};
setInterval(fetchStatus, 1000);

const toggleSelect = () => {
  console.log(this);
  list[id].element.classList.toggle('selected');
  list[id].selected = !list[id].selected;
}

const sendCommand = (command) => {
  for(var i in list) {
    if(list[i].selected) fetch(`/control/${i}/${command}`);
  }
}
