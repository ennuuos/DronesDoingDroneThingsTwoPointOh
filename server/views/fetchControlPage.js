const fetchControlPage = (command) => {
    let radios = document.getElementById("radiotr").getElementsByTagName("input");
    for(var i = 0; i < radios.length; i++) {
      radio=radios[i];
      if(radio.checked) {
        let url = 'control/' + radio.value + '/' + command;
        console.log(url);
        fetch(url);
      }
    }
}

setTimeout(window.location.reload.bind(window.location), 1000);
