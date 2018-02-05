
let scores = {};
let score_divs = {};
const game_module = () => {

	console.log("Loaded war game");

	let game_div = document.getElementById('game_div');
    game_div.style = "display:grid; text-align: center; vertical-align:middle; font-size: 120px;";


    setInterval(() => {
        fetchScores();
        renderScores();
    }, 100);


};

const createDiv = function(id) {
    let game_div = document.getElementById('game_div');
    score_divs[id] = document.createElement('div');
    score_divs[id].style = `border-right: 2px solid grey; border-left: 2px solid grey; grid-column: ${id}`;
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
        score_divs[k].innerHTML = scores[k];

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
