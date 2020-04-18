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
      socket.on('create', function (data) {
        socket.join(data.id);
        socket.broadcast.emit('create');
      });

      socket.on('join', function (data) { // data contains room info
        socket.join(data.roomID);
        socket.to(data.roomID).emit('join',data);
      });

      socket.on('leave', function (data) { // data contains room info
        socket.leave(data.ID);
        socket.to(data.roomID).emit('leave',data);
      });

      socket.on('loading', function (data) { // data contains room info
        socket.to(data.roomID).emit('loading',data);
      });

      socket.on('started', function (data) { // data contains message to show up
        socket.to(data.roomID).emit('started');
      });

      socket.on('ended', function (data) { // data contains message to show up
        socket.to(data.roomID).emit('ended');
      });

      socket.on('winner', function (data) { // data contains message to show up
        io.in(data.roomID).emit('winner',data);
      });

      socket.on('message', function (data) { // data contains message to show up
        socket.to(data.roomID).emit('message',data);
      });

      socket.on('block', function (data) { // notify everyone someone blocked
        socket.to(data.roomID).emit('block');
      });

      socket.on('challenge', function (data) { // notify everyone someone bsed
        socket.to(data.roomID).emit('challenge',data);
      });

      socket.on('challengeResults', function (data) { // notify everyone someone bsed
        socket.to(data.roomID).emit('challengeResults',data);
      });

      socket.on('action', function (data) { // notify everyone someone did a bsable/blockable action
        socket.to(data.roomID).emit('action',data);
      });

      socket.on('getInfo', function (data) { // notify everyone of next player
        io.in(data.roomID).emit('getInfo');
      });

      socket.on('ok', function (data) { // notify everyone of next player
        io.in(data.roomID).emit('ok', data);
      });
      //End ON Events
  });
  return router;
};