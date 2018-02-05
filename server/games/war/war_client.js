
const game_module = () => {

	console.log("Loaded war game");

	let game_div = document.getElementById('game_div');
    game_div.style = "display:grid; grid-template-columns: 50% 50%; text-align: center; vertical-align:middle; font-size: 120px;";

    let score_one = 1;
    let score_two = 3;

	let score_one_div = document.createElement('div')
    game_div.appendChild(score_one_div);
    let score_two_div = document.createElement('div')
    game_div.appendChild(score_two_div);

    score_one_div.style = "border-right: 2px solid grey;"
    score_two_div.style = "border-left: 2px solid grey;"

    fetch('/game/1', {
        method: 'POST';
    };
    fetch('/game/2', {
        method: 'POST';
    };
	setInterval(() => {
        score_one_div.innerHTML = score_one;
        score_two_div.innerHTML = score_two;
    }, 100);

    setInterval(() => {
        fetchScores();
    }, 100);


};

const fetchScores = function() {
    fetch('/game/scores')
    .then(res => res.json())
    .then(data => {
        score_one = data[1];
        score_two = data[2];
    }).catch(err => console.log(err));
}
