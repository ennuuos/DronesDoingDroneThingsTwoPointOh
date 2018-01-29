const game_module = () => {

	console.log("Loaded follow game");

	let game_div = document.getElementById('game_div');

	let canvas = document.createElement('canvas')
	game_div.appendChild(canvas);
	let context = canvas.getContext('2d');

	let direction = 0;
	let direction2 = 0;

	const refreshRate = 10;

	setInterval(() => {direction += 0.01;}, refreshRate);
	setInterval(() => {direction2 -= 0.04;}, refreshRate);

	setInterval((context) => {
		context.lineWidth = 5;
		context.strokeStyle="#0000FF";
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.arc(60, 60, 50, direction * Math.PI, (direction + 0.3) * Math.PI);
		context.stroke();

		context.lineWidth = 2;
		context.strokeStyle="#FF0000";

		let x = Math.cos(direction) * 50;
		let y = Math.sin(direction) * 50;
		context.moveTo(60, 60);
		context.lineTo(x + 60, y + 60);
		context.stroke();
	}, refreshRate, context);

	setInterval(() => console.log(direction), 100);




}
