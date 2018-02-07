const express = require('express');
const path = require("path");
let clientCommands = require('./clientCommands.json');
let config = require('./config.json');

module.exports = function(app, drones) {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());

    app.get('/', (req, res) => {
        res.render('index', {
            defaultDegree: config.default_degree,
            clientCommands: clientCommands
        });
      });

    app.get('/camera', (req, res) => {
        res.render('camera', {});
    });

    app.post('/control/:id/:action', (req, res) => {
        console.log(req.url, req.body.degree);

        let id = req.params['id'];
        let action = req.params['action'];

        if (drones.control(id, action, req.body.degree)) {
            res.status(200).send('OK');
        } else {
            res.status(400).send('Bad Request');
        }
    });

    app.get('/status', (req, res) => {
        res.send(drones.status());
    });

	app.get('/js/game_module.js', (req, res) => {
		res.sendFile(path.join(__dirname, config.games_directory, config.game, `${config.game}_client.js`));
	});
    app.get('/game', (req, res) => {
        res.render(path.join(__dirname, config.games_directory, config.game, `game.pug`));
    });
};
