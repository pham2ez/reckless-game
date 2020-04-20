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
      let winner = game.players.filter(player => !game.deadPlayers.includes(player))[0];
      let index = game.players.indexOf(winner);
      game.playerIndex = index === -1? 0: index;
      game.players = players; // in case someone leaves/someone new comes
      game.state = "MOVE"
      game.coinDict = coinDict;
      game.courtList = courtList;
      game.deadPlayers = [];
      game.deadCards = {"N":0,"A1":0,"T":0,"C":0,"D":0};
      game.playersCards = {}
      this.distributeCards(game);
    }else{
      game = { ID, players, "currentState": {"state": "MOVE", "action": "", "fromPlayer": "", "toPlayer": ""},
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
    truncated.currentState = game.currentState;
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
  static nextState(req){
    let game = this.findGame(req.roomID);
    let currentState = game.currentState;
    if(currentState.state === "MOVE"){
      if(req.action === "IN" || req.action === "A2"){
        this.doMove(game, req.fromPlayer, undefined, req.action, req.cards);
      }else if(req.action === "COUP"){
        game.currentState = {"state": "KILL", "action": req.action,
          "fromPlayer": req.fromPlayer, "toPlayer": req.toPlayer};
      }else if(req.action === "T" || req.action === "N"){
        game.currentState = {"state": "CHOOSE", "action": req.action,
          "fromPlayer": req.fromPlayer, "toPlayer": req.toPlayer};
      }else{
        game.currentState = {"state": "CHOOSE", "action": req.action,
          "fromPlayer": req.fromPlayer, "toPlayer": ""};
      }
    }else if(currentState.state === "CHOOSE"){
      if(req.action === "OK"){
        let action = currentState.action;
        if(action === "FA" || action === "D" || action === "A1"){
          game.oks++;
          if(game.oks !== (game.players.length-1 - game.deadPlayers.length)){
            return false;
          }else{
            game.oks = 0;
            this.doMove(game, currentState.fromPlayer, undefined, action, undefined);
            currentState.state = "MOVE";
          }
        }else{
          if(req.fromPlayer !== stcurrentStateate.toPlayer){
            return false;
          }else{
            if(action === "T"){
              this.doMove(game, currentState.fromPlayer, currentState.toPlayer, action, undefined);
              currentState.state = "MOVE";
            }else if(action === "N"){

            }
          }
        }
      }else if(req.state === "BLOCK"){
        currentState.blockedAction = req.action;
        if(currentState.action === "D"){
          currentState.toPlayer = req.fromPlayer;
        }
      }else if(req.state === "CHALLENGE"){
        let player = currentState.blockedAction === undefined? currentState.toPlayer: currentState.fromPlayer;
        let action = currentState.blockedAction === undefined? currentState.action: currentState.blockedAction;
        if(game.playersCards[player].includes(action)){
          currentState.state = "KILL";
          currentState.loser = req.player; // can be current player or blocking player
        }else{
          currentState.state = "KILL";
          currentState.loser = player;
        }
      }
    }else if(currentState.state === "KILL"){
      if(currentState.loser !== undefined){ // exists challenge result
        if(currentState.loser !== currentState.fromPlayer){
          this.doMove(game, currentState.fromPlayer, currentState.toPlayer, currentState.action, req.cards); 
        }
        this.doMove(game, currentState.loser, undefined, "BS", req.cards); 
      }else{ // coup, assassin loses money
        this.doMove(game, currentState.fromPlayer, currentState.toPlayer, currentState.action, req.cards); 
      }
      currentState.state = "MOVE";
    }
    return true;
  }

  // do after we check if other player wants to block or wants to bs this player
  static doMove(game, player1, player2, action, kill){
    if(player1 in game.deadPlayers)
      return;
    if(action === "IN"){
      this.addCoins(game,player1,1);
    }else if(action === "FA"){
      this.addCoins(game,player1,2);
    }else if(action === "COUP"){
      this.addCoins(game,player1,-7);
      this.killAction(game, player2, kill[0])
    }else if(action === "BS"){
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
      return game.players[index];
    }
    if(action !== "A1" && action != "BS"){
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

module.exports = Coup;
