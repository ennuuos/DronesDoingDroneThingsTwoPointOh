const express   = require('express');
const	path      = require("path");

module.exports = function(app, drones) {

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/control/:id/:action', (req, res) => {
    console.log(req.url);
    let id = req.params['id'];
    let action = req.params['action'];
    drones.control(id, action);
		res.end();
  });

  app.get('/status', (req, res) => {
    res.send(drones.status());
  });

};
