let data = [];
let Users = require('./Users.js');
/**
 * @typedef Reckless
 */

/**
 * @class Reckless
 * Game init, actions, and rules.
 */
class Reckless {
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
      let winner = game.players.filter(player => !game.deadPlayers.includes(player))[0];
      let index = game.players.indexOf(winner);
      game.playerIndex = index === -1? 0: index;
      game.players = players; // in case someone leaves/someone new comes
      game.checkpoint = {"state": "WAIT", "completed": true};
      game.coinDict = coinDict;
      game.courtList = courtList;
      game.deadPlayers = [];
      game.deadCards = {"N":0,"A1":0,"T":0,"C":0,"D":0};
      game.playersCards = {}
      this.distributeCards(game);
    }else{
      game = { ID, players, "checkpoint": {"state": "WAIT", "completed": true},
        "oks": 0, "coinDict": coinDict, "courtList": courtList,
        "playersCards": {}, "playerIndex": 0, "deadPlayers": [], "deadCards": {"N":0,"A1":0,"T":0,"C":0,"D":0}};
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
    truncated.checkpoint = game.checkpoint;
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
    do{
      game.playerIndex = (game.playerIndex + 1) % game.players.length;
    }while(game.deadPlayers.includes(game.players[game.playerIndex]))
  }

  // GAME ACTIONS
  static checkpoint(req,id){
    let game = this.findGame(id);
    if(req.state === "MOVE"){ // change to appropriate state, save action and player
      game.checkpoint.action = req.action;
      game.checkpoint.player = req.player;
      game.checkpoint.toPlayer = req.toPlayer;
      if(req.action === "RECK"){
        game.checkpoint.state = "KILL";
      }else if(req.action === "IN"){
        game.checkpoint.state = "MOVE";
      }else{
        game.checkpoint.state = "CHOOSE";
        game.checkpoint.responded = [req.player];
        game.checkpoint.completed = false;
      }
    }else if(req.state === "CHOOSE"){
      game.checkpoint.responded.push(req.player);
    }else if(req.state === "FINISH"){ // move done, check if challenge loser needs to pick card to kill
      game.checkpoint.player = game.checkpoint.action !== "A1"? undefined: game.checkpoint.player;
      game.checkpoint.completed = game.checkpoint.loser === undefined;
      game.checkpoint.state = game.checkpoint.completed && game.checkpoint.action !== "A1"? "WAIT": "KILL";
      game.checkpoint.action = game.checkpoint.action !== "A1"? game.checkpoint.action: "A2";
    }else if(req.state === "BLOCK"){ // another round of choosing whether or not to challenge
      game.checkpoint.responded = [];
      game.checkpoint.blockedAction = req.action;
      game.checkpoint.toPlayer = req.player;
    }else if(req.state === "CHALLENGE"){
      game.checkpoint.loser = req.player;
      game.checkpoint.completed = false;
      game.checkpoint.state = "KILL";
      if(game.checkpoint.loser === game.checkpoint.player){
        game.checkpoint.player = undefined;
      }
    }else if(req.state === "KILL"){
      if(req.player === game.checkpoint.loser){ // challenge loser chose card
        game.checkpoint.loser = undefined;
        game.checkpoint.completed = game.checkpoint.loser === undefined;
      }else if(req.player === game.checkpoint.player){ // spy needs to finish
        game.checkpoint.player = undefined;
        game.checkpoint.completed = game.checkpoint.loser === undefined;
      }else if(req.player === game.checkpoint.toPlayer){ // samurai/reck
        game.checkpoint.completed = true;
      }
      game.checkpoint.state = game.checkpoint.completed? "WAIT": "KILL";
    }
  }

  static doMove(id, player1, player2, action, kill){
    let game = this.findGame(id);
    if(player1 in game.deadPlayers)
      return;
    if(action === "IN"){
      this.addCoins(game,player1,1);
    }else if(action === "FA"){
      this.addCoins(game,player1,2);
    }else if(action === "RECK"){
      this.addCoins(game,player1,-7);
      this.killAction(game, player2, kill[0])
    }else if(action === "BS1" || action === "BS2"){
      for(let i = 0; i < kill.length; i++){
        this.killAction(game, player2, kill[i])
      }
    }else if(action === "N"){
      this.addCoins(game,player1,-3);
      this.killAction(game, player2, kill[0]);
    }else if(action === "A1"){
      this.dealCards(game, player1, 2);
    }else if(action === "A2"){
      this.popCardOutHand(game, player1,kill[0]);
      this.popCardOutHand(game, player1,kill[1]);
      game.courtList.push(kill[0]);
      game.courtList.push(kill[1]);
      this.shuffleDeck(game.courtList);
    }else if(action === "D"){
      this.addCoins(game,player1,3);
    }else if(action === "T"){
      this.addCoins(game,player1,2);
      this.addCoins(game,player2,-2);
    }
    if(game.deadPlayers.length === game.players.length - 1){
      let winner = game.players.filter(player => !game.deadPlayers.includes(player))[0];
      let index = game.players.indexOf(winner);
      game.checkpoint.state = "ROOM";
      return game.players[index];
    }
    if(action !== "A1" && action != "BS1"){
      do{
        game.playerIndex = (game.playerIndex + 1) % game.players.length;
      }while(game.deadPlayers.includes(game.players[game.playerIndex]))
    }
    return false;
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
    if(deadCard !== undefined){
      this.popCardOutHand(game, player, deadCard);
      game.deadCards[deadCard]++;
      if(game.playersCards[player].length == 0){
        game.deadPlayers.push(player);
      }
    }
  }
}

module.exports = Reckless;
