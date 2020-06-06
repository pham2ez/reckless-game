const express = require('express');

const router = express.Router();

const Rooms = require('../models/Rooms');
/**
 * Create a room on Coup.
 * @name POST/api/room
 * @return {Room} - the created room
 * @throws {401} - if user is not signed in
 */
router.post('/', (req, res) => {
  if (req.session.username === undefined) {
    res.status(401).json({
      error: `Please sign in to create a game room.`,
    }).end();
  }else {
    const room = Rooms.createRoom(req.session.username, req.body.name, req.body.password);
    res.status(200).json(room).end();
  }
});

/**
 * @name GET/api/room/rooms
 * @param {string} user - user's username
 * @return list of all rooms
 */
router.get('/rooms', (req, res) => {
  res.status(200).json(Rooms.allRooms()).end();
});

/**
 * @name POST/api/room/find/:name
 * @param {string} user - user's username
 * @return list of rooms starting with name
 */
router.get('/find/:name', (req, res) => {
  res.status(200).json(Rooms.findRooms(req.params.name)).end();
});


/**
 * Check password for a room on Coup.
 * @name PUT/api/room/password/:id
 * @return {boolean} - if correct password
 * @throws {403} - if password is wrong
 */
router.put('/password/:id', (req, res) => {
  let accessed = Rooms.checkPassword(req.params.id, req.body.passwordAttempt);
  if(accessed){
    res.status(200).json(Rooms.join(req.params.id, req.session.username)).end();
  }else{
    res.status(403).json({
      error: `Wrong password entered.`,
    }).end();
  }
});

/**
 * Join a room on Coup.
 * @name PUT/api/room/players/:id
 * @return {boolean} - if joined the room or not
 * @throws {400} - if room doesn't exist
 * @throws {401} - if user is not signed in
 */
router.put('/players/:id', (req, res) => {
  let gameRoom = Rooms.findRoomID(req.params.id);
  if (gameRoom === undefined) {
    res.status(400).json({
      error: `Game room does not exist.`,
    }).end();
  }else if (gameRoom.players.length === 6) {
    res.status(400).json({
      error: `Already 6 people in the room.`,
    }).end();
  }else if (req.session.username === undefined) {
    res.status(401).json({
      error: `Please sign in to join a game room.`,
    }).end();
  }else {
    res.status(200).json(Rooms.join(req.params.id, req.session.username)).end();
  }
});

/**
 * Leave a room on Coup.
 * @name DELETE/api/room/players/:id
 * @return {boolean} - if left the room or not
 * @throws {400} - if room doesn't exist
 * @throws {401} - if user is not signed in
 */
router.delete('/players/:id', (req, res) => {
  let gameRoom = Rooms.findRoomID(req.params.id);
  if (gameRoom === undefined) {
    res.status(400).json({
      error: `Game room does not exist.`,
    }).end();
  }else if (req.session.username === undefined) {
    res.status(401).json({
      error: `Please sign in to join a game room.`,
    }).end();
  }else {
    res.status(200).json(Rooms.leave(req.params.id, req.session.username)).end();
  }
});

router.put('/start/:id', (req, res) => {
  let gameRoom = Rooms.findRoomID(req.params.id);
  if (gameRoom === undefined) {
    res.status(400).json({
      error: `Game room does not exist.`,
    }).end();
  }else if (gameRoom.creator !== req.session.username) {
    res.status(401).json({
      error: `You are not the creator of the room.`,
    }).end();
  }else {
    Rooms.startGame(req.params.id,req.session.username);
    res.status(200).json(true).end();
  }
});

router.put('/end/:id', (req, res) => {
  let gameRoom = Rooms.findRoomID(req.params.id);
  if (gameRoom === undefined) {
    res.status(400).json({
      error: `Game room does not exist.`,
    }).end();
  }else if (gameRoom.creator !== req.session.username) {
    res.status(401).json({
      error: `You are not the creator of the room.`,
    }).end();
  }else {
    Rooms.endGame(req.params.id);
    res.status(200).json(true).end();
  }
});

module.exports = router;
