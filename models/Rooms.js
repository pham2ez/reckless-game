let data = [];
let roomCounter = 0;
let Coup = require('./Coup.js');
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
    const room = {creator, roomName, "id": roomCounter.toString(), "players": [creator]};
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
    return room;
  }

  static leave(ID, username){
    let room = this.findRoomID(ID);
    room.players = room.players.filter(user => user !== username);
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
    Coup.startGame(ID, room.players);
  }

  static endGame(ID){
    Coup.endGame(ID);
  }
}

module.exports = Rooms;
