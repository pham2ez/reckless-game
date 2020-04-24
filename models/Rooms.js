let data = [];
let roomCounter = 0;
let Coup = require('./Coup.js');
let Users = require('./Users.js');
/**
 * @typedef Rooms
 * @prop {string} creator - the admin of the room
 * @prop {string} roomName - the human readable name
 * @prop {string} id - id of room
 * @prop {string} players - list of players in room
 */

/**
 * @class Rooms
 * Stores all Rooms and their information.
 */
class Rooms {
  static createRoom(creator, roomName) {
    const room = {creator, roomName, "id": roomCounter.toString(), "players": [creator], "inGame": false};
    Users.addToRoom(creator, roomCounter.toString());
    roomCounter++;
    data.push(room);
    return room;
  }

  static allRooms() {
    return data
  }

  static findRoomID(ID) {
    return data.filter(room => room.id === ID)[0];
  }

  static findRooms(name) {
    return data.filter(room => room.roomName.substring(0,name.length) === name || room.id.substring(0,name.length) === name);
  }

  static join(ID, username){
    let room = this.findRoomID(ID);
    room.players.push(username);
    Users.addToRoom(username, ID);
    return room;
  }

  static leave(ID, username){
    let room = this.findRoomID(ID);
    room.players = room.players.filter(user => user !== username);
    Users.removeFromRoom(username);
    if(username === room.creator){
      room.creator = room.players[0];
    }
    if(room.players.length === 0){
      data = data.filter(room => room.id !== ID);
    }
    return room;
  }

  static startGame(ID, username){
    let room = this.findRoomID(ID);
    room.inGame = true;
    Coup.startGame(ID, room.players);
  }

  static endGame(ID){
    let room = this.findRoomID(ID);
    room.inGame = false;
    Coup.endGame(ID);
  }
}

module.exports = Rooms;
