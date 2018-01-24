const	path			= require("path");
const express		= require('express');
const app				= express();
app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));

let drones = require('./drones');
require('./routes')(app, drones);

app.listen(3000, () => console.log('Drone app listening on port 3000.'))
