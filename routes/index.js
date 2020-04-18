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
      socket.on('loggedIn', function (data) { // updates everyone's game list
        if(data !== null){
          socket.join(data);
        }else{
          socket.join("WaitingRoom");
        }
      });

      socket.on('loggedOut', function (data) { // updates everyone's game list
        socket.leave("WaitingRoom");
        if(data !== null){
          socket.leave(data);
        }
      });

      socket.on('create', function (data) { // updates everyone's game list
        socket.join(data.id);
        socket.leave("WaitingRoom");
        io.in("WaitingRoom").emit('create');
      });

      socket.on('join', function (data) { // data contains room info
        socket.to(data.roomID).emit('join',data);
        socket.join(data.roomID);
        socket.leave("WaitingRoom");
        io.in("WaitingRoom").emit('create');
      });

      socket.on('leave', function (data) { // data contains room info
        socket.leave(data.id);
        socket.to(data.id).emit('leave',data);
        socket.join("WaitingRoom");
        io.in("WaitingRoom").emit('create');
      });

      socket.on('loading', function (data) { // data contains room info
        socket.to(data.roomID).emit('loading');
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
        io.in(data.roomID).emit('block', data);
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