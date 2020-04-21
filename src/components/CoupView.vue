<template>
  <div class="coup">
    <div class="cards" v-if="gameInfo !== null">
      <b-button variant="outline-dark" v-b-modal="'info'" @click="playSound('INFO')">Game Info</b-button>
      <Info title="My Cards" :textArray="myCardsArray"/>
      <Info title="Dead Cards" :textArray="deadCardsArray"/>
      <!-- The modal -->
      <b-modal id="info" size="lg" title="Coup Actions" hide-footer>
        <b-img :src="require('./media/rules.jpg')" fluid-grow></b-img>
      </b-modal>
    </div>
    <div class="actions" v-show="currentPlayer && chosenAction === null">
      <b-button v-show="!coup" @click="income">Income</b-button>
      <b-button v-show="!coup" @click="foreignAid">Foreign Aid</b-button>
      <b-button v-show="(available || coup)" @click="coupClick">Coup</b-button>
    </div>
    <div class="cards" v-show="currentPlayer && !coup">
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
              v-show="player !== username && ((chosenAction === 'T' && gameInfo.coinDict[player] >= 2) || chosenAction === 'N' || chosenAction === 'COUP')"
              @click="choose(player)">{{player}}</b-button>
            <b-button variant="outline-dark" @click="back">Back</b-button>
          </div>
        </b-modal>

        <b-modal :title="'Choose which card to block with'" :visible="showChooseBlock" no-close-on-esc no-close-on-backdrop hide-footer hide-header-close>
          <div class="actions">
            <b-button  v-show="chosenAction === 'FA'" @click="chooseBlock('D')">Duke</b-button>
            <b-button v-show="chosenAction === 'T'" @click="chooseBlock('A1')">Ambassador</b-button>
            <b-button v-show="chosenAction === 'T'" @click="chooseBlock('T')">Captain</b-button>
            <b-button v-show="chosenAction === 'N'" @click="chooseBlock('C')">Contessa</b-button>
          </div>
        </b-modal>

        <b-modal :title="title" :visible="show" no-close-on-esc no-close-on-backdrop hide-footer hide-header-close>
          <div class="actions">
            <b-button v-show="blockable" @click="block">Block</b-button>
            <b-button v-show="challengable" @click="challenge">Challenge</b-button>
            <b-button @click="handleOk">Do Nothing</b-button>
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
  name: 'CoupView',
  components: {Card, Info},
  props: ["username", "players", "roomID"],
  data() {
    return {
      chosenAction: null,
      chosenPlayer: null,
      currentAction: null,
      blocking: false,

      currentPlayer: false,

      showChoose: false,
      showChooseBlock: false,
      showKill: false,
      show: false,

      myCoins: 0,
      available: false,
      coup: false,
      oks: 0,
      numKill: 0,
      inKill: [false,false,false,false],

      title: "",
      dict: {"A1":"Ambassador", "C":"Contessa", "T":"Captain", "D":"Duke", "N":"Assassin", "COUP": "coup", "FA": "foreign aid"},
      gameInfo: null,
      deadCardsArray: [],
      myCardsArray: [],
    }
  },
  created: function(){
    socket.on("getInfo", () => {
      
      axios.get('/api/coup/info/' + this.roomID, this.body)
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
      if(data.toPlayer === this.username && data.action === "COUP"){
        this.chosenAction = "COUP";
        this.numKill = 1;
        this.showKill = true;
        return;
      }
      this.show = true;
      this.title = this.currentAction.fromPlayer + "'s " + this.dict[this.currentAction.action];
      this.title += data.toPlayer !== undefined? " to " + data.toPlayer: "";
    });

    socket.on("challenge",(req)=>{
      if(this.username === req.toPlayer && this.gameInfo.myCards.includes(req.action)){
        this.playSound("WINNER");
        axios.put('/api/coup/update/'+this.roomID, {"state": "CHALLENGE", "player": req.fromPlayer});
        let kill = this.chosenAction === "N"? 2: 1;
        socket.emit("challengeResults",{"roomID": this.roomID, "loser": req.fromPlayer, "kill": kill});
        eventBus.$emit("add-message",{"message": this.username + " did have " + 
          this.dict[this.chosenAction], "roomID": this.roomID});
        if(this.chosenAction !== "N" && this.gameInfo.numCards[req.fromPlayer] > kill){
          this.finish();
        }
      }else if(this.username === req.toPlayer && !this.gameInfo.myCards.includes(req.action)){
        this.playSound("LOSER");
        axios.put('/api/coup/update/'+this.roomID, {"state": "CHALLENGE", "player": req.toPlayer});
        socket.emit("challengeResults",{"roomID": this.roomID, "winner": req.fromPlayer});
        eventBus.$emit("add-message",{"message": this.username + " did not have " + 
          this.dict[req.action], "roomID": this.roomID});
        this.chosenAction = "BS2";
        this.numKill = req.action === "C" && this.gameInfo.myCards.length === 2? 2: 1;
        this.showKill = true; // for challenge
      }else{ // not the one being challenged so can wait
        this.clearModal();
      }
    });

    socket.on("challengeResults",(req)=>{
      if(this.username === req.loser){
        this.playSound("LOSER");
        this.chosenAction = "BS1";
        this.showKill = true; // for challenge
        this.numKill = req.kill > this.gameInfo.myCards.length? this.gameInfo.myCards.length: req.kill;
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
          this.finish();
        }else if(this.oks === (this.players.length-1 - this.gameInfo.deadPlayers.length)){
          eventBus.$emit("add-message", {"message": "Action successfully went through", "roomID": this.roomID});
          this.finish();
        }
      }
    });

    eventBus.$on("signin-success", (res) => {
      if(res.gameInfo !== undefined){
        this.$nextTick(function () {
          this.gameInfo = res.gameInfo;
          this.gamePopu();
          this.currentState();
        })
      }
    });

    eventBus.$on("chosen-card", (req)=>{
      this.currentPlayer = false;
      this.chosenAction = req;
      if(this.blocking){
        axios.put('/api/coup/update/'+this.roomID, {"state": "BLOCK", "action": req, "player": this.username});
        eventBus.$emit("add-message",{"message": this.username + " blocks with " + this.dict[this.chosenAction], "roomID": this.roomID});
        this.currentAction = {"roomID": this.roomID, "action": this.chosenAction, "blockedAction": this.currentAction.action,
          "fromPlayer": this.username, "toPlayer": this.currentAction.fromPlayer};
        socket.emit("action", this.currentAction);
      }else if(req === "N" || req === "T"){
        this.showChoose = true;
      }else{
        axios.put('/api/coup/update/'+this.roomID, {"state": "MOVE", "action": req, "player": this.username});
        eventBus.$emit("add-message",{"message": this.username + " chose " + this.dict[req], "roomID": this.roomID});
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
        this.coup = false;
      }else if(this.myCoins >= 10){
        this.available = true;
        this.coup = true;
      }else{
        this.available = true;
        this.coup = false;
      }
      eventBus.$emit("game-info",this.gameInfo);
      if(this.chosenAction === "A1"){
        this.chosenAction = "A2";
        this.showKill = true;
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
      eventBus.$emit("add-message",{"message": this.username + " chose income", "roomID": this.roomID});
    },
    foreignAid: function(){
      this.chosenAction = "FA";
      this.currentPlayer = false;
      eventBus.$emit("add-message",{"message": this.username + " chose foreign aid", "roomID": this.roomID});
      this.currentAction = {"roomID": this.roomID, "action": this.chosenAction, "fromPlayer": this.username};
      socket.emit("action", this.currentAction);
    },
    coupClick: function(){
      this.showChoose = true;
      this.chosenAction = "COUP";
    },
    choose: function(player){
      this.chosenPlayer = player;
      this.showChoose = false;
      eventBus.$emit("add-message",{"message": this.username + " picked " + player + " to use "
       + this.dict[this.chosenAction] + " on", "roomID": this.roomID});
       this.currentAction = {"roomID": this.roomID, "action": this.chosenAction, "fromPlayer": this.username, "toPlayer": player};
      axios.put('/api/coup/update/'+this.roomID, {"state": "MOVE", "action": this.chosenAction, "player": this.username, "toPlayer": player});
      socket.emit("action", this.currentAction);
    },
    chooseBlock: function(role){
      this.showChooseBlock = false;
      eventBus.$emit("chosen-card",role);
    },
    finish: function(){
      axios.put('/api/coup/update/'+this.roomID, {"state": "FINISH"});
      this.body = {"id": this.roomID, "player1": this.username, "player2": this.chosenPlayer,
        "action":this.chosenAction, "cards":[]}
      axios.put('/api/coup/move', this.body)
      .then(() => {
        socket.emit("getInfo", {"roomID": this.roomID});
        if(this.chosenAction === "A1"){
          this.numKill = 2;
        }
      });
    },
    block: function(){
      this.clearModal();
      this.blocking = true;
      this.showChooseBlock = true;
      this.chosenAction = this.currentAction.action;
      socket.emit("block",{"roomID": this.roomID, "player": this.username});
      eventBus.$emit("add-message", {"message": this.username + " is blocking", "roomID": this.roomID});
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
      axios.put('/api/coup/update/'+this.roomID, {"state": "CHOOSE", "player": this.username});
      if(this.currentAction.blockedAction === undefined){ // allow move
        eventBus.$emit("add-message", {"message": this.username + " did nothing", "roomID": this.roomID}); // if original player
        if(this.currentAction.action === "N" && this.username === this.currentAction.toPlayer){ // if oked assassin on theirself
          socket.emit("block",{"roomID": this.roomID});
          socket.emit("ok", {"roomID": this.roomID, "player": this.currentAction.fromPlayer, "okPlayer": this.username});
          this.chosenAction = "N";
          this.numKill = 1;
          this.showKill = true; // for assassin
        }else if(this.currentAction.action === "T" && this.username === this.currentAction.toPlayer){ // if oked assassin on theirself
          socket.emit("block",{"roomID": this.roomID});
          socket.emit("ok", {"roomID": this.roomID, "player": this.currentAction.fromPlayer, "okPlayer": this.username});
        }else{
          socket.emit("ok", {"roomID": this.roomID, "player": this.currentAction.fromPlayer, "okPlayer": this.username});
        }
      }else{ // allow block
        eventBus.$emit("add-message", {"message": "Action was successfully blocked", "roomID": this.roomID});
        if(this.chosenAction === "N"){ // wasted 3 coins to try to assassin
          this.finish();
        }else{
          axios.put('/api/coup/update/'+this.roomID, {"state": "FINISH"});
          axios.get('/api/coup/next/'+this.roomID)
          .then(() => {
            socket.emit("getInfo", {"roomID": this.roomID});
          });
        }
      }
    },
    handleKill: function(){
      this.showKill = false;
      let chosenCards = [];
      let str = this.username + " chose to kill ";
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
        eventBus.$emit("add-message", {"message": str + "to die", "roomID": this.roomID});
        body.player1 = this.currentAction.fromPlayer;
        body.player2 = this.username;
      }

      axios.put('/api/coup/move', body)
      .then((req) => {
        this.clear();
        if(req.data !== false){
          socket.emit("winner",{"roomID": this.roomID, "winner": req.data});
          eventBus.$emit("add-message", {"message": req.data + " won the game!", "roomID": this.roomID});
        }else{
          axios.put('/api/coup/update/'+this.roomID, {"state": "KILL", "player": this.username})
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
          this.showKill = true;
          if(checkpoint.loser === checkpoint.fromPlayer){
            this.chosenAction = "BS2";
            this.numKill = checkpoint.blockedAction === "C" && this.gameInfo.myCards.length === 2? 2: 1;
          }else if(checkpoint.loser === checkpoint.toPlayer){
            this.numKill = checkpoint.action === "N" && this.gameInfo.myCards.length === 2? 2: 1;
          }else{
            this.numKill = 1;
          }
        }else if(checkpoint.toPlayer === this.username){ // assassin/coup
          this.chosenAction = checkpoint.action;
          this.showKill = true;
          this.numKill = 1;
        }else if(checkpoint.player === this.username && checkpoint.action === "A2"){ // ambassador
          this.chosenAction = "A2";
          this.showKill = true;
          this.numKill = 2;
        }
      }
    },
    playSound: function(situation){
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
      audio.volume(.5);
      audio.play();
    }
  }
}
</script>

<style scoped>
.coup{
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
