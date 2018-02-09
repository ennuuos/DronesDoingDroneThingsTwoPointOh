
let scores = {};
let score_divs = {};

const startGame = () => {
	let game_div = document.getElementById('game_div');
    game_div.style = "display:grid; text-align: center; vertical-align:middle; font-size: 140px;";

    setInterval(() => {
        fetchScores();
        renderScores();
    }, 100);
};

const createDiv = function(id) {
    let game_div = document.getElementById('game_div');
    score_divs[id] = document.createElement('div');
    let styles = {
        1: "color: red; grid-column: 1; grid-row: 1;",
        2: "color: green; grid-column: 2; grid-row: 1;",
        3: "color: blue; grid-column: 3; grid-row: 1;",
        4: "color: black; grid-column: 4; grid-row: 1;",
    };
    score_divs[id].style = styles[id];
    console.log(score_divs[id]);
    game_div.appendChild(score_divs[id]);
}

const renderScores = function() {
    for(let k in scores) {
        if(!(k in score_divs)) createDiv(k);
    }
    for(let k in score_divs) {
        if(!(k in scores)) {
            document.getElementById('game_div').removeChild(score_divs[k]);
            delete score_divs[k];
            continue;
        }
        score_divs[k].innerHTML = `<span style="font-size: 18px;">Drone ${k}</span><br>${scores[k]}`;
    }
}

const addDronesToGame = function() {
    for(let id in drones_selected) {
        fetch(`/game/${id}`, {method: 'POST'});
    }
}

const removeDronesFromGame = function() {
    for(let id in drones_selected) {
        fetch(`/game/${id}`, {method: 'DELETE'});
    }
}

const fetchScores = function() {
    fetch('/game/scores')
    .then(res => res.json())
    .then(data => {
        scores = data;
    }).catch(err => console.log(err));
}
