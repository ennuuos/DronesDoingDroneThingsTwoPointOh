const path = require("path");
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));

let drones = require('./drones');
require('./routes')(app, drones);

let config = require('./config.json');

let game = require(
    path.join(__dirname, config.games_directory, config.game)
)(app, drones);

app.listen(config.network.port, () => console.log(
    `Drone app listening on port ${config.network.port}.`
));

const vision = require('./vision.js');
