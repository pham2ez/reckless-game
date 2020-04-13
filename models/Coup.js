let data = [];
let Users = require('./Users.js');
/**
 * @typedef Coup
 */

/**
 * @class Coup
 * Game init, actions, and rules.
 */
class Coup {
  // INIT ACTIONS
  static startGame(ID, players){
    // make and shuffle deck
    let courtList = this.initDeck();
    // dist. 2 coins per player
    let coinDict = {};
    for(let i = 0; i < players.length; i++){
      coinDict[players[i]] = 2;
    }
    // look to see if pre-existing game
    let game = this.findGame(ID);
    if(game !== undefined){
      let winner = game.deadPlayers.filter(player => !game.players.includes(player))[0];
      game.playerIndex = game.players.indexOf(winner);
      game.players = players; // in case someone leaves/someone new comes
      game.coinDict = coinDict;
      game.courtList = courtList;
      game.deadPlayers = [];
      game.deadCards = {"N":0,"A1":0,"T":0,"C":0,"D":0};
      game.playersCards = {}
      this.distributeCards(game);
    }else{
      game = { ID, players, "coinDict": coinDict, "courtList": courtList, "playersCards": {}, "playerIndex": 0, "deadPlayers": [], "deadCards": {"N":0,"A1":0,"T":0,"C":0,"D":0}};
      this.distributeCards(game);
      data.push(game);
    }
    return game;
  }
  static truncGame(id, player){
    let game = this.findGame(id);
    if(!game.players.includes(player)){return null;}

    let truncated = {};
    truncated.coinDict = game.coinDict;
    truncated.deadPlayers = game.deadPlayers;
    truncated.deadCards = game.deadCards;
    truncated.myCards = game.playersCards[player];
    truncated.playerIndex = game.playerIndex;
    truncated.numCards = {};
    for(const i of game.players){
      truncated.numCards[i] = game.playersCards[i].length;
    }
    return truncated
  }

  static findGame(ID) {
    return data.filter(game => game.ID === ID)[0];
  }

  static endGame(ID){
    let game = this.findGame(ID);
    for(let i = 0; i < game.players.length; i++){
      Users.game(game.players[i], i === game.playerIndex);
    }
  }

  static initDeck(){
    let courtList = [];
    let cards = ["N", "A1", "C", "D", "T"];
    for(let i = 0; i < 5; i++){
      for(let j = 0; j < 3; j++){
        courtList.push(cards[i]);
      }
    }
    this.shuffleDeck(courtList);
    return courtList;
  }

  static shuffleDeck(courtList){
    for (let i = courtList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [courtList[i], courtList[j]] = [courtList[j], courtList[i]];
    }
  }

  static distributeCards(game){
    for(let i = 0; i < game.players.length; i++){
      game.playersCards[game.players[i]] = [];
    }
    for(let j = 0; j < game.players.length; j++){
      this.dealCards(game, game.players[j], 2);
    }
  }

  static dealCards(game, player, num){
    for(let i = 0; i < num; i ++){
      game.playersCards[player].push(game.courtList.shift());
    }
  }
  // ADMIN ACTIONS
  static next(ID){
    let game = this.findGame(ID);
    game.playerIndex = (game.playerIndex + 1) % game.players.length;
  }

  // GAME ACTIONS

  // do after we check if other player wants to block or wants to bs this player
  static doMove(ID, player1, player2, action, kill){
    let game = this.findGame(ID);
    if(action === "IN"){
      this.addCoins(game,player1,1);
    }else if(action === "FA"){
      this.addCoins(game,player1,2);
    }else if(action === "COUP"){
      this.addCoins(game,player1,-7);
      this.killAction(game, player2, kill[0])
    }else if(action === "BS1" || action === "BS2"){
      this.killAction(game, player2, kill[0])
      if(kill[1] !== undefined){
        this.killAction(game, player2, kill[1])
      }
    }else if(action === "N"){
      this.addCoins(game,player1,-3);
      this.killAction(game, player2, kill[0]);
    }else if(action === "A1"){
      this.dealCards(game, player1, 2);
    }else if(action === "A2"){
      this.popCardOutHand(game, player2,kill[0]);
      this.popCardOutHand(game, player2,kill[1]);
      game.courtList.push(kill[0]);
      game.courtList.push(kill[1]);
      this.shuffleDeck(game.courtList);
    }else if(action === "D"){
      this.addCoins(game,player1,3);
    }else if(action === "T"){
      this.addCoins(game,player1,2);
      this.addCoins(game,player2,-2);
    }else if(action === "EX"){
      this.popCardOutHand(game, player1, kill[0]);
      game.playersCards[player1].push(game.courtList.shift());
      game.courtList.push(kill[0]);
      this.shuffleDeck(game.courtList);
    }
    if(action !== "A1" && action != "BS1"){
      game.playerIndex = (game.playerIndex + 1) % game.players.length;
    }
  }

  // PLAYER ACTIONS
  static addCoins(game, player, num){
    game.coinDict[player] += num;
  }

  static popCardOutHand(game, player, card){
    let ind = game.playersCards[player].indexOf(card);
    game.playersCards[player].splice(ind,1);
  }

  static killAction(game, player, deadCard){ // true if player is dead
    this.popCardOutHand(game, player, deadCard);
    game.deadCards[deadCard]++;
    if(game.playersCards[player].length == 0){
      game.deadPlayers.push(player);
      if(game.deadPlayers.length === game.players.length - 1){
        for(let i = 0; i < game.players.length; i++){
          if(!game.deadPlayers.includes(game.players[i])){
            game.playerIndex = i;
          }
        }
        return true; // stop game
      }
    }
    return false; // continue game
  }
}

module.exports = Coup;
