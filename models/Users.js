let data = [];
/**
 * @typedef Users
 * @prop {string} username - name associated with a user and their freets
 * @prop {string} password - password to access account that only the user knows
 * @prop {string} gamesPlayed - total number of games played
 * @prop {string} gamesWon - number of games won
 * @prop {string} friends - list of friends available to invite
 * @prop {string} friendRequests - list of users who is requesting to be friends with user
 */

/**
 * @class Users
 * Stores all Users and their information.
 */
class Users {
  static addUser(username, password) {
    const user = { username, password, "gamesPlayed": 0, "gamesWon": 0, "friends": [], "friendRequests": []};
    data.push(user);
    return user;
  }

  static findUser(username) {
    return data.filter(user => user.username === username)[0];
  }

  static findUsers(username, searcher) {
    let users = data.filter(user => user.username.substring(0,username.length) === username
      && !user.friends.includes(searcher)
      && !user.friendRequests.includes(searcher)
      && user.username !== searcher);
    return users.map(user => user.username);
  }

  static requestFriend(username, requestTo){
    Users.findUser(requestTo).friendRequests.push(username);
    return "Friend request to " + requestTo + " sent.";
  }

  static acceptFriend(username, requested){
    Users.findUser(requested).friends.push(username);
    Users.findUser(username).friends.push(requested);
    let user = Users.findUser(username);
    user.friendRequests = user.friendRequests.filter(user => user !== requested);
    return "Friend request from " + requested + " accepted.";
  }

  static rejectFriend(username, requested){
    let user = Users.findUser(username);
    user.friendRequests = user.friendRequests.filter(user => user !== requested);
    return "Friend request from " + requested + " rejected.";
  }

  static game(user, won){
    let u = this.findUser(user);
    u.gamesPlayed++;
    if(won){
      u.gamesWon++;
    }
  }
}

module.exports = Users;