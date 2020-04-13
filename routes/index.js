const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Coup w/ Friends' });
});

module.exports = router;
module.exports = function (io) {
  //Socket.IO
  io.on('connection', function (socket) {
      console.log('User has connected to Index');
      //ON Events
      socket.on('create', function () {
        socket.broadcast.emit('create');
      });

      socket.on('join', function (data) { // data contains room info
        socket.broadcast.emit('join',data);
      });

      socket.on('leave', function (data) { // data contains room info
        socket.broadcast.emit('leave',data);
      });

      socket.on('started', function () { // data contains message to show up
        socket.broadcast.emit('started');
      });

      socket.on('ended', function () { // data contains message to show up
        socket.broadcast.emit('ended');
      });

      socket.on('winner', function (data) { // data contains message to show up
        socket.broadcast.emit('winner',data);
      });

      socket.on('message', function (data) { // data contains message to show up
        console.log(data);
        socket.broadcast.emit('message',data);
      });

      socket.on('block', function (data) { // notify everyone someone blocked
        socket.broadcast.emit('block',data);
      });

      socket.on('challenge', function (data) { // notify everyone someone bsed
        socket.broadcast.emit('challenge',data);
      });

      socket.on('challengeResults', function (data) { // notify everyone someone bsed
        socket.broadcast.emit('challengeResults',data);
      });

      socket.on('action', function (data) { // notify everyone someone did a bsable/blockable action
        socket.broadcast.emit('action',data);
      });

      socket.on('getInfo', function () { // notify everyone of next player
        io.emit('getInfo');
      });

      socket.on('ok', function (data) { // notify everyone of next player
        socket.broadcast.emit('ok', data);
      });
      //End ON Events
  });
  return router;
};