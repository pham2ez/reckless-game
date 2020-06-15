<template>
  <div class="reck">
    <div class="cards" v-if="gameInfo !== null">
      <b-button variant="outline-dark" v-b-modal="'info'" @click="playSound('INFO')">Game Info</b-button>
      <Info title="My Cards" :textArray="myCardsArray"/>
      <Info title="Dead Cards" :textArray="deadCardsArray"/>
      <!-- The modal -->
      <b-modal id="info" size="lg" title="Game Info" hide-footer>
        <b-table striped hover :items="items"></b-table>
      </b-modal>
    </div>
    <div class="actions" v-show="currentPlayer && chosenAction === null">
      <b-button v-show="!reck" @click="income">Steady Income</b-button>
      <b-button v-show="!reck" @click="corruptIncome">Corrupt Income</b-button>
      <b-button v-show="(available || reck)" @click="reckClick">Execute</b-button>
    </div>
    <div class="cards" v-show="currentPlayer && !reck">
      <!-- only on their turn -->
      <Card v-bind:role="'D'"
        v-bind:available="chosenAction === null"/>
      <Card v-bind:role="'N'"
        v-bind:available="chosenAction === null && myCoins >= 3"/>
      <Card v-bind:role="'A1'"
        v-bind:available="chosenAction === null"/>
      <Card v-bind:role="'T'"
        v-bind:available="chosenAction === null"/>
      <Card v-bind:role="'C'"
        v-bind:available="false"/>
    </div>
    <div class="modals">
      <!-- The modals -->
        <b-modal :title="'Choose a player to use ' + dict[chosenAction] + ' on'" :visible="showChoose" no-close-on-esc no-close-on-backdrop hide-footer hide-header-close>
          <div class="actions">
            <b-button v-for="player in players"
              v-bind:key="player"
              v-show="player !== username && ((chosenAction === 'T' && gameInfo.coinDict[player] >= 2) || chosenAction === 'N' || chosenAction === 'RECK')"
              @click="choose(player)">{{player}}</b-button>
            <b-button variant="outline-dark" @click="back">Back</b-button>
          </div>
        </b-modal>

        <b-modal :title="'Choose which card to block with'" :visible="showChooseBlock" no-close-on-esc no-close-on-backdrop hide-footer hide-header-close>
          <div class="actions">
            <b-button  v-show="chosenAction === 'FA'" @click="chooseBlock('D')">King</b-button>
            <b-button v-show="chosenAction === 'T'" @click="chooseBlock('A1')">Spy</b-button>
            <b-button v-show="chosenAction === 'T'" @click="chooseBlock('T')">Pirate</b-button>
            <b-button v-show="chosenAction === 'N'" @click="chooseBlock('C')">Rogue</b-button>
          </div>
        </b-modal>

        <b-modal :title="title" :visible="show" no-close-on-esc no-close-on-backdrop hide-footer hide-header-close>
          <div class="actions">
            <b-button v-show="blockable" @click="block">Block</b-button>
            <b-button v-show="challengable" @click="challenge">Challenge</b-button>
            <b-button @click="handleOk">Do Nothing</b-button>
          </div>
        </b-modal>

        <b-modal :title="'You have been overthrown'" :visible="dead" no-close-on-esc no-close-on-backdrop hide-footer hide-header-close>
          <div class="actions">
            <b-button @click="instaKill">Accept Defeat</b-button>
          </div>
        </b-modal>
        
        <b-modal :title="'Choose ' + numKill + ' card(s) to give up'" v-if="gameInfo !== null" :visible="showKill" no-close-on-esc no-close-on-backdrop hide-header-close hide-footer>
          <div class="actions">
            <b-button v-for="i in gameInfo.myCards.length"
              :variant="inKill[i-1]? 'danger': 'warning'"
              v-bind:key="gameInfo.myCards[i-1] + i"
              :pressed.sync="inKill[i-1]"
              @click="kill(i-1)">
              {{dict[gameInfo.myCards[i-1]]}}
            </b-button>
            <b-button variant="dark" :disabled="numKill !== 0" @click="handleKill">Finish</b-button>
          </div>
        </b-modal>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus, socket } from "../main";
import Card from './Card.vue';
import Info from './Info.vue';

export default {
  name: 'RecklessView',
  components: {Card, Info},
  props: ["username", "players", "roomID", "funMode"],
  data() {
    return {
      items: [
        { character: "Anyone", action_name: 'Steady Income', effect: 'Gain 1 gold piece.', can_block: "-"},
        { character: "Anyone", action_name: 'Corrupt Income', effect: 'Gain 2 gold pieces.', can_block: "-"  },
        { character: "Anyone", action_name: 'Overthrow', effect: 'Player of your choice will have to have one of their people executed.', can_block: "-"  },
        { character: "King", action_name: 'Tax', effect: 'Gain 3 gold pieces.', can_block: "Corrupt Income. You are the only one that can be corrupt in this kingdom.", _rowVariant: "primary"  },
        { character: "Pirate", action_name: 'Threaten', effect: 'Gain 2 gold pieces from a player of your choice.', can_block: "Threaten. Feels unthreatened by other pirates.", _rowVariant: "success"  },
        { character: "Rogue", action_name: '-', effect: '-', can_block: "Slay. Would never let themselves be slain by a mere samurai.", _rowVariant: "warning"  },
        { character: "Samurai", action_name: 'Slay', effect: 'Player or your choice will be slain by your hands.', can_block: "-", _rowVariant: "danger"  },
        { character: "Spy", action_name: 'Impersonate', effect: 'Pick up 2 roles and choose 2 to keep.', can_block: "Threaten. Ability to impersonate anyone throws off those darn pirates.", _rowVariant: "info"  }
      ],

      chosenAction: null,
      chosenPlayer: null,
      currentAction: null,
      blocking: false,
      dead: false,

      currentPlayer: false,

      showChoose: false,
      showChooseBlock: false,
      showKill: false,
      show: false,

      myCoins: 0,
      available: false,
      reck: false,
      oks: 0,
      numKill: 0,
      inKill: [false,false,false,false],

      title: "",
      dict: {"A1":"Spy", "C":"Rogue", "T":"Pirate", "D":"King", "N":"Samurai", "RECK": "overthrow", "FA": "corrupt income"},
      gameInfo: null,
      deadCardsArray: [],
      myCardsArray: [],
    }
  },
  created: function(){
    socket.on("getInfo", () => {
      
      axios.get('/api/reck/info/' + this.roomID, this.body)
      .then((res) => {
        if(res.data.checkpoint.completed && this.chosenAction !== "A1"){
          this.clear();
        }
        this.gameInfo = res.data;
        this.gamePopu();
      });
    });

    socket.on("ended", ()=>{
      this.clear();
    });

    socket.on("action", (data) => {
      this.currentAction = data;
      if(this.currentAction.blockedAction !== undefined && this.currentAction.fromPlayer){
        this.playSound("BLOCK");
      }else{
        this.playSound("MOVE");
      }
      if(data.toPlayer === this.username && data.action === "RECK"){
        this.chosenAction = "RECK";
        this.numKill = 1;
        this.checkKill();
        return;
      }
      this.show = true;
      this.title = this.currentAction.fromPlayer + "'s " + this.dict[this.currentAction.action];
      this.title += data.toPlayer !== undefined? " to " + data.toPlayer: "";
    });

    socket.on("challenge",(req)=>{
      if(this.username === req.toPlayer && this.gameInfo.myCards.includes(req.action)){
        this.playSound("WINNER");
        axios.put('/api/reck/update/'+this.roomID, {"state": "CHALLENGE", "player": req.fromPlayer});
        let kill = this.chosenAction === "N"? 2: 1;
        socket.emit("challengeResults",{"roomID": this.roomID, "loser": req.fromPlayer, "kill": kill});
        eventBus.$emit("add-message",{"message": this.username + " did have " + 
          this.dict[this.chosenAction], "roomID": this.roomID});
        if(this.chosenAction !== "N" && this.gameInfo.numCards[req.fromPlayer] > kill){
          this.finish();
        }
      }else if(this.username === req.toPlayer && !this.gameInfo.myCards.includes(req.action)){
        this.playSound("LOSER");
        axios.put('/api/reck/update/'+this.roomID, {"state": "CHALLENGE", "player": req.toPlayer});
        socket.emit("challengeResults",{"roomID": this.roomID, "winner": req.fromPlayer});
        eventBus.$emit("add-message",{"message": this.username + " did not have " + 
          this.dict[req.action], "roomID": this.roomID});
        this.chosenAction = "BS2";
        this.numKill = req.action === "C" && this.gameInfo.myCards.length === 2? 2: 1;
        this.checkKill(); // if lose challenge
      }else{ // not the one being challenged so can wait
        this.clearModal();
      }
    });

    socket.on("challengeResults",(req)=>{
      if(this.username === req.loser){
        this.playSound("LOSER");
        this.chosenAction = "BS1";
        this.numKill = req.kill > this.gameInfo.myCards.length? this.gameInfo.myCards.length: req.kill;
        this.checkKill(); // if lose challenge
      }else if(this.username === req.winner){
        this.playSound("WINNER");
      }
    });

    socket.on("block",()=>{
      this.clearModal();
    });

    socket.on("ok",(req)=>{
      if(this.username === req.player){
        this.oks++;
        if((this.chosenAction === "T" || this.chosenAction === "N") && req.okPlayer === this.chosenPlayer){
          if(this.chosenAction === "T") {this.finish();}
        }else if(this.oks === (this.players.length-1 - this.gameInfo.deadPlayers.length)){
          eventBus.$emit("add-message", {"message": "Action successfully went through", "color":"#008f11", "roomID": this.roomID});
          this.finish();
        }
      }
    });

    eventBus.$on("in-game", (res) => {
      this.gameInfo = res.gameInfo;
      this.$nextTick(function () {
        this.gamePopu();
        this.currentState();
      });
    });

    eventBus.$on("chosen-card", (req)=>{
      this.currentPlayer = false;
      this.chosenAction = req;
      if(this.blocking){
        axios.put('/api/reck/update/'+this.roomID, {"state": "BLOCK", "action": req, "player": this.username});
        eventBus.$emit("add-message",{"message": this.username + " blocks with " + this.dict[this.chosenAction], "roomID": this.roomID});
        this.currentAction = {"roomID": this.roomID, "action": this.chosenAction, "blockedAction": this.currentAction.action,
          "fromPlayer": this.username, "toPlayer": this.currentAction.fromPlayer};
        socket.emit("action", this.currentAction);
      }else if(req === "N" || req === "T"){
        this.showChoose = true;
      }else{
        axios.put('/api/reck/update/'+this.roomID, {"state": "MOVE", "action": req, "player": this.username});
        eventBus.$emit("add-message",{"message": this.username + " chose " + this.dict[req], "color":"#2a9df4", "roomID": this.roomID});
        this.currentAction = {"roomID": this.roomID, "action": this.chosenAction, "fromPlayer": this.username};
        socket.emit("action", this.currentAction);
      }
    });
  },
  computed: {
    blockable: function(){
      if(this.currentAction === null){
        return false;
      }else{
        let blockableRoles = ["FA","N","T"];
        return this.currentAction.blockedAction !== undefined? false: 
          (this.currentAction.toPlayer === this.username || this.currentAction.action === "FA") &&
            blockableRoles.includes(this.currentAction.action);
      }
    },
    challengable: function(){
      let challengableRoles = ["D","N","T","C","A1"];
      return this.currentAction === null? false: challengableRoles.includes(this.currentAction.action);
    }
  },
  methods: {
    clear: function(){
      this.chosenAction = null;
      this.chosenPlayer = null;
      this.currentAction = null;
      this.blocking = false;

      this.showChoose = false;
      this.showKill = false;

      this.oks = 0;
      this.numKill = 0;
      this.inKill = [false,false,false,false];
    },
    gamePopu: function(){
      this.deadCardsPopu();
      this.myCardsPopu();
      this.currentPlayer = this.username===this.players[this.gameInfo.playerIndex] && this.gameInfo.checkpoint.completed;
      this.myCoins = this.gameInfo.coinDict[this.username];
      if(this.myCoins < 7){
        this.available = false;
        this.reck = false;
      }else if(this.myCoins >= 10){
        this.available = true;
        this.reck = true;
      }else{
        this.available = true;
        this.reck = false;
      }
      eventBus.$emit("game-info",this.gameInfo);
      if(this.chosenAction === "A1"){
        this.chosenAction = "A2";
        this.numKill = 2;
        this.checkKill();
      }
    },
    clearModal: function(){
      this.show = false;
    },
    back: function(){
      this.chosenAction = null;
      this.currentPlayer = true;
      this.showChoose = false;
    },
    income: function(){
      this.chosenAction = "IN";
      this.finish();
      eventBus.$emit("add-message",{"message": this.username + " chose steady income", "color":"#2a9df4", "roomID": this.roomID});
    },
    corruptIncome: function(){
      this.chosenAction = "FA";
      this.currentPlayer = false;
      eventBus.$emit("add-message",{"message": this.username + " chose corrupt income", "color":"#2a9df4", "roomID": this.roomID});
      this.currentAction = {"roomID": this.roomID, "action": this.chosenAction, "fromPlayer": this.username};
      socket.emit("action", this.currentAction);
    },
    reckClick: function(){
      this.showChoose = true;
      this.chosenAction = "RECK";
    },
    choose: function(player){
      this.chosenPlayer = player;
      this.showChoose = false;
      eventBus.$emit("add-message",{"message": this.username + " picked " + player + " to use "
       + this.dict[this.chosenAction] + " on", "color":"#2a9df4", "roomID": this.roomID});
       this.currentAction = {"roomID": this.roomID, "action": this.chosenAction, "fromPlayer": this.username, "toPlayer": player};
      axios.put('/api/reck/update/'+this.roomID, {"state": "MOVE", "action": this.chosenAction, "player": this.username, "toPlayer": player});
      socket.emit("action", this.currentAction);
    },
    chooseBlock: function(role){
      this.showChooseBlock = false;
      eventBus.$emit("chosen-card",role);
    },
    finish: function(){
      axios.put('/api/reck/update/'+this.roomID, {"state": "FINISH"});
      this.body = {"id": this.roomID, "player1": this.username, "player2": this.chosenPlayer,
        "action":this.chosenAction, "cards":[]}
      axios.put('/api/reck/move', this.body)
      .then(() => {
        socket.emit("getInfo", {"roomID": this.roomID});
      });
    },
    block: function(){
      this.clearModal();
      this.blocking = true;
      this.showChooseBlock = true;
      this.chosenAction = this.currentAction.action;
      socket.emit("block",{"roomID": this.roomID, "player": this.username});
      eventBus.$emit("add-message", {"message": this.username + " is blocking", "color":"#d3d3d3", "roomID": this.roomID});
    },
    challenge: function(){
      this.clearModal();
      eventBus.$emit("add-message",{"message": this.username + " challenges " + 
      this.currentAction.fromPlayer + "'s " + this.dict[this.currentAction.action], "roomID": this.roomID});
      socket.emit("challenge", {"roomID": this.roomID, "action": this.currentAction.action,
      "fromPlayer": this.username, "toPlayer": this.currentAction.fromPlayer});
    },
    handleOk: function(){
      this.clearModal();
      axios.put('/api/reck/update/'+this.roomID, {"state": "CHOOSE", "player": this.username});
      if(this.currentAction.blockedAction === undefined){ // allow move
        eventBus.$emit("add-message", {"message": this.username + " did nothing", "color":"#d3d3d3",  "roomID": this.roomID}); // if original player
        if(this.currentAction.action === "N" && this.username === this.currentAction.toPlayer){ // if oked slay on theirself
          socket.emit("block",{"roomID": this.roomID});
          socket.emit("ok", {"roomID": this.roomID, "player": this.currentAction.fromPlayer, "okPlayer": this.username});
          this.chosenAction = "N";
          this.numKill = 1;
          this.checkKill(); // for the slain
        }else if(this.currentAction.action === "T" && this.username === this.currentAction.toPlayer){ // if oked slay on theirself
          socket.emit("block",{"roomID": this.roomID});
          socket.emit("ok", {"roomID": this.roomID, "player": this.currentAction.fromPlayer, "okPlayer": this.username});
        }else{
          socket.emit("ok", {"roomID": this.roomID, "player": this.currentAction.fromPlayer, "okPlayer": this.username});
        }
      }else{ // allow block
        eventBus.$emit("add-message", {"message": "Action was successfully blocked", "color":"#008f11", "roomID": this.roomID});
        if(this.chosenAction === "N"){ // wasted 3 coins to try to slay another player
          this.finish();
        }else{
          axios.put('/api/reck/update/'+this.roomID, {"state": "FINISH"});
          axios.get('/api/reck/next/'+this.roomID)
          .then(() => {
            socket.emit("getInfo", {"roomID": this.roomID});
          });
        }
      }
    },
    checkKill: function(){
      if(this.numKill >= this.gameInfo.myCards.length){
        this.dead = true;
      }else{
        this.showKill = true;
      }
    },
    instaKill: function(){
      eventBus.$emit("add-message", {"message": this.username + " has been overthrown", "color":"#f42a38", "roomID": this.roomID});
      for(let i = 0; i < this.gameInfo.myCards.length; i++){
        this.inKill[i] = true;
      }
      this.handleKill();
      this.dead = false;
    },
    handleKill: function(){
      this.showKill = false;
      let chosenCards = [];
      let str = this.username + " chose to execute ";
      for(let i = 0; i < this.inKill.length; i++){
        if(this.inKill[i]){
          chosenCards.push(this.gameInfo.myCards[i]);
          str += this.dict[this.gameInfo.myCards[i]] + " "
        }
      }
      let body = {"id": this.roomID, "action": this.chosenAction, "cards": chosenCards}
      if(this.chosenAction === "A2"){
        eventBus.$emit("add-message", {"message": this.username + " put 2 cards back into the deck", "roomID": this.roomID});
        body.player1 = this.username;
      }else{
        this.playSound("CARD");
        eventBus.$emit("add-message", {"message": str, "color":"#f4812a", "roomID": this.roomID});
        body.player1 = this.currentAction.fromPlayer;
        body.player2 = this.username;
      }

      axios.put('/api/reck/move', body)
      .then((req) => {
        this.clear();
        if(req.data !== false){
          socket.emit("winner",{"roomID": this.roomID, "winner": req.data});
          eventBus.$emit("add-message", {"message": req.data + " won the game!", "color":"#9700f6", "roomID": this.roomID});
        }else{
          axios.put('/api/reck/update/'+this.roomID, {"state": "KILL", "player": this.username})
          .then(()=>{
            socket.emit("getInfo", {"roomID": this.roomID});
          })
        }
      });
    },
    kill: function(index){
      if(this.inKill[index]){
        this.numKill--;
      }else{
        this.numKill++;
      }
    },
    myCardsPopu: function(){
      let array = []
      for(let i = 0; i < this.gameInfo.myCards.length; i++){
        array.push(this.dict[this.gameInfo.myCards[i]]);
      }
      this.myCardsArray = array;
    },
    deadCardsPopu: function(){
      let array = []
      for(let key in this.gameInfo.deadCards){
        array.push(this.dict[key] + ": " + this.gameInfo.deadCards[key] + "/3");
      }
      this.deadCardsArray = array;
    },
    currentState: function(){ // recovery function
      let checkpoint = this.gameInfo.checkpoint;
      if(checkpoint.state === "ROOM"){
        this.clear();
        return;
      }
      this.currentAction = {"roomID": this.roomID, "fromPlayer": checkpoint.player, "toPlayer": checkpoint.toPlayer};
      if(checkpoint.state === "CHOOSE"){
        if(checkpoint.responded.includes(this.username)){
          this.oks = checkpoint.responded.length-1;
          this.chosenPlayer = checkpoint.toPlayer;
          this.chosenAction = checkpoint.action;
          return;
        }
        this.show = true;
        this.currentAction.action = checkpoint.action;
        this.chosenAction = "BS1";
        this.title = checkpoint.toPlayer === undefined? checkpoint.player + "'s " + this.dict[checkpoint.action]:
          checkpoint.player + "'s " + this.dict[checkpoint.action] + " to " + checkpoint.toPlayer;
      }else if(checkpoint.state === "KILL"){
        this.currentPlayer = false;
        if(checkpoint.loser === this.username){ // challenge
          this.chosenAction = "BS1";
          if(checkpoint.loser === checkpoint.fromPlayer){
            this.chosenAction = "BS2";
            this.numKill = checkpoint.blockedAction === "C" && this.gameInfo.myCards.length === 2? 2: 1;
          }else if(checkpoint.loser === checkpoint.toPlayer){
            this.numKill = checkpoint.action === "N" && this.gameInfo.myCards.length === 2? 2: 1;
          }else{
            this.numKill = 1;
          }
        }else if(checkpoint.toPlayer === this.username){ // samurai/reck
          this.chosenAction = checkpoint.action;
          this.numKill = 1;
        }else if(checkpoint.player === this.username && checkpoint.action === "A2"){ // spy
          this.chosenAction = "A2";
          this.numKill = 2;
        }
        this.checkKill();
      }
    },
    playSound: function(situation){
      if(!this.funMode){
        return;
      }
      var audio;
      if(situation === "INFO"){
        let prob = Math.random();
        if(prob <= .1){
          audio = new Audio(require('./media/rick.mp3'));
        }else if(prob <= .45){
          audio = new Audio(require('./media/myTralala.mp3'));
        }else{
          audio = new Audio(require('./media/trololo.mp3'));
        }
      }else if(situation === "CARD"){
        let prob = Math.random();
        if(prob <= .33){
          audio = new Audio(require('./media/minecraftHurt.mp3'));
        }else if(prob <= .66){
          audio = new Audio(require('./media/robloxHurt.mp3'));
        }else{
          audio = new Audio(require('./media/bruh.mp3'));
        }
      }else if(situation === "BLOCK"){
        audio = new Audio(require('./media/surpriseMofo.mp3'));
      }else if(situation === "MOVE"){
        audio = new Audio(require('./media/mgsAlert.mp3'));
      }else if(situation === "WINNER"){ // of challenge
        let prob = Math.random();
        if(prob <= .33){
          audio = new Audio(require('./media/airhorn.mp3'));
        }else if(prob <= .66){
          audio = new Audio(require('./media/yeet.mp3'));
        }else{
          audio = new Audio(require('./media/wow.mp3'));
        }
      }else if(situation === "LOSER"){ // of challenge
        let prob = Math.random();
        if(prob <= .25){
          audio = new Audio(require('./media/allahu.mp3'));
        }else if(prob <= .5){
          audio = new Audio(require('./media/omg1.mp3'));
        }else if(prob <= .75){
          audio = new Audio(require('./media/youSuck.mp3'));
        }else{
          audio = new Audio(require('./media/omg2.mp3'));
        }
      }
      audio.play();
    }
  }
}
</script>

<style scoped>
.reck{
  display: flex;
  width:70%;
  flex-direction: column;
}

.class{
  display: flex;
  flex-grow: 1;
}
.cards{
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.actions{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
