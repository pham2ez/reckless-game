const express = require('express');

const router = express.Router();

const Users = require('../models/Users');
const Rooms = require('../models/Rooms');
const Reckless = require('../models/Reckless');
/**
 * Create a user on Reckless.
 * @name POST/api/user/
 * @param {string} username - user's chosen username
 * @param {string} password - user's chosen password
 * @return {User} - the created user
 * @throws {409} - if username is already taken
 */
router.post('/', (req, res) => {
  if(req.body.username.length == 0 || req.body.password.length == 0){
    res.status(400).json({
      error: `Please enter a valid username/password.`,
    }).end();
  } else if (Users.findUser(req.body.username) !== undefined) {
    res.status(409).json({
      error: `Username ${req.body.username} is already taken.`,
    }).end();
  } else {
    const user = Users.addUser(req.body.username, req.body.password);
  	req.session.username = req.body.username;
    res.status(200).json({"username": req.session.username}).end();
  }
});

/**
 * Return list of friends on Reckless.
 * @name GET/api/user/friends
 * @return {boolean} - if successfully requested
 * @throws {400} - if already following user
 * @throws {401} - if user is not signed in
 * @throws {404} - if user does not exist
 */
router.get('/friends/', (req, res) => {
  let user = Users.findUser(req.session.username);
  if(user !== undefined){
    res.status(200).json(user.friends).end();
  }else{
    res.status(200).json([]).end();
  }
});


/**
 * Request to be friends with a user on Reckless.
 * @name POST/api/user/friend/:user
 * @return {boolean} - if successfully requested
 * @throws {400} - if already following user
 * @throws {401} - if user is not signed in
 * @throws {404} - if user does not exist
 */
router.post('/request/:user', (req, res) => {
  let user = Users.findUser(req.params.user);
  if (req.session.username === undefined) {
    res.status(401).json({
      error: `Please sign in to friend request.`,
    }).end();
  }else if (user === undefined) {
    res.status(400).json({
      error: `User does not exist.`,
    }).end();
  }else {
    res.status(200).json({
      message: Users.requestFriend(req.session.username,req.params.user),
    }).end();
  }
});

/**
 * Accept friend request from user on Reckless.
 * @name PUT/api/user/accept/:user
 * @return {boolean} - if successfully accepted
 * @throws {401} - if user is not signed in
 * @throws {400} - if user does not exist
 */
router.put('/request/:user', (req, res) => {
  res.status(200).json({
    message: Users.acceptFriend(req.session.username,req.params.user),
  }).end();
});

/**
 * Get all friend requests of user.
 * @name PUT/api/user/accept/:user
 * @return {User} - list of friend requests
 * @throws {401} - if user is not signed in
 * @throws {400} - if user does not exist
 */
router.get('/request/', (req, res) => {
  res.status(200).json(Users.findUser(req.session.username).friendRequests).end();
});

/**
 * Reject friend request from user on Reckless.
 * @name DELETE/api/user/accept/:user
 * @return {boolean} - if successfully accepted
 * @throws {401} - if user is not signed in
 */
router.delete('/request/:user', (req, res) => {
  res.status(200).json({
    message: Users.rejectFriend(req.session.username,req.params.user),
  }).end();
});

/**
 * @name GET/api/user/find/:user
 * @param {string} user - user's username
 * @return list of users with usernames starting with user
 * @throws {400} - if username/password is invalid
 */
router.get('/find/:user', (req, res) => {
  users = Users.findUsers(req.params.user, req.session.username);
  res.status(200).json(users).end();
});

/**
 * Sign in a user onto Reckless.
 * @name POST/api/user/signin
 * @param {string} username - user's username
 * @param {string} password - user's password
 * @return session
 * @throws {400} - if username/password is invalid
 */
router.post('/signin', (req, res) => {
  let foundUser = Users.findUser(req.body.username);
  if( req.session.username !== undefined){
	  res.status(400).json({
      error: `You're already signed in. Please sign out to sign in to another account.`,
    }).end();
  }else if(foundUser===undefined){
    res.status(400).json({
      error: `No user with that username found.`,
    }).end();
  }else if(foundUser.password !== req.body.password){
	  res.status(400).json({
      error: `Invalid password.`,
    }).end();
  }else{
  	req.session.username = req.body.username;
	  res.status(200).json({"username": req.session.username}).end();
  }
});

router.get('/signedin', (req, res) => {
  let username = req.session.username;
  if(username === undefined){
    res.status(200).json(false).end();
  }else{
    let user = Users.findUser(username);
    if(user.roomID !== null){
      let room = Rooms.findRoomID(user.roomID);
      let game = room.inGame? Reckless.truncGame(user.roomID, user.username): undefined;
      res.status(200).json({"username": user.username, "roomInfo": room,
      "gameInfo": game}).end();
    }else{
      res.status(200).json({"username": user.username}).end();
    }
  }
});

/**
 * Sign out a user on Reckless.
 * @name DELETE/api/user/signout
 * @return session
 * @throws {401} - if user is not signed in
 */
router.delete('/signout', (req, res) => {
  if(req.session.username === undefined){
	  res.status(401).json({
      error: `Please sign in first to sign out.`,
    }).end();
  }else{
    req.session.username = undefined;
    res.status(200).json(req.session).end();
  }
});

module.exports = router;
