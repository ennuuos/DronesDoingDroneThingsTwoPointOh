const fetchControlPage = (command) => {
    let dropDown = document.getElementById("droneSelector");
    let droneID = dropDown.options[dropDown.selectedIndex].value;
    let url = 'control/' + droneID + '/' + command;
    console.log(url);
    fetch(url);
}
