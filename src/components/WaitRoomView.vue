<template>
  <div class="wait">
    <h2>{{roomName}}</h2>
    {{players.length}}/6 players
    <div class="players">
      <b-card
      v-for="i in players.length"
      v-bind:key="players[i-1]"
      :title="players[i-1]"
      :bg-variant="bgVariant(i-1)"
      :text-variant="textVariant(i-1)">
        <b-card-text>
          {{playerText(players[i-1])}}
        </b-card-text>
        <b-card-text v-if="blocking === players[i-1]">
          Player is blocking.
        </b-card-text>
        <b-card-text v-if="okedPlayers.includes(players[i-1])">
          Player did nothing.
        </b-card-text>
      </b-card>
    </div>
    <div v-show="!inGame && !loading" class="wait">
      <b-button variant="info" :disabled="username !== creator || players.length<2" @click="start">Start</b-button>
      <b-button variant="outline-dark" @click="leave">Leave</b-button>
    </div>
    <b-spinner v-show="loading" variant="primary" label="Spinning"></b-spinner>
    <div v-show="inGame">
      <b-modal :visible="inGame && winner !== ''" no-close-on-esc no-close-on-backdrop hide-header hide-footer>
        The winner is {{winner.winner}}.
        <b-button v-if="creator===username" @click="end">End</b-button>
      </b-modal>
    </div>

    <div class="columns">
      <Messages/>
      <CoupView 
      v-show="inGame && !dead"
      v-bind:username="username"
      v-bind:players="players"
      v-bind:roomID="roomID"/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus,socket } from "../main";
import Messages from './Messages.vue';
import Card from './Card.vue';
import CoupView from './CoupView.vue';

export default {
  name: 'WaitRoomView',
  components: {Messages,CoupView,Card},
  props: ["username"],
  data() {
    return {
      creator:"",
      players:[],
      roomID:"",
      roomName:"",

      dead: false,
      deadPlayers: [],
      okedPlayers: [],
      numCards: {},
      coinDict: {},
      playerIndex: 0,
      inGame: false,
      winner: "",
      blocking: "",
      
      loading: false,
      dict: {"A1":"Ambassador", "C":"Contessa", "T":"Captain", "D":"Duke", "N":"Assassin"}
    }
  },
  created: function(){
    socket.on('join', (data) => {
      this.players = data.players;
    });

    socket.on('leave', (data) => {
      this.players = data.players;
      this.creator = data.creator;
    });

    socket.on("ended",()=>{
      this.clear();
    });

    socket.on("winner",(data)=>{
      this.winner = data;
      if(data === this.username){
        this.playSound("WINNER");
      }else{
        this.playSound("LOSER");
      }
    });

    eventBus.$on("joined-room", (res) => {
      this.creator = res.creator;
      this.players = res.players;
      this.roomID = res.id;
      this.roomName = res.roomName;
    });

    eventBus.$on("signin-success", (res) => {
      if(res.roomInfo !== undefined){
        this.creator = res.roomInfo.creator;
        this.players = res.roomInfo.players;
        this.roomID = res.roomInfo.id;
        this.roomName = res.roomInfo.roomName;
        if(res.gameInfo !== undefined && res.gameInfo.checkpoint.state !== "WAIT"){
          this.inGame = true;
          this.loading = true;
          eventBus.$emit("in-game", res);
        }
      }
    });

    eventBus.$on("leave-room", (username) => {
      this.leave(username);
    });

    eventBus.$on("game-info", (req) => {
      this.blocking = null;
      this.loading = false;
      this.okedPlayers = [];
      this.deadPlayers = req.deadPlayers;
      this.dead = req.deadPlayers.includes(this.username);
      this.numCards = req.numCards;
      this.coinDict = req.coinDict;
      this.playerIndex = req.playerIndex;
      this.inGame = true;
    });

    socket.on("ok",(data)=>{
      this.okedPlayers.push(data.okPlayer);
    })

    socket.on("block",(data)=>{
      this.blocking = data.player;
    })

    socket.on("loading", () => {
      this.loading = true;
    });
  },
  methods: {
    clear: function(){
      this.dead= false;
      this.deadPlayers= [];
      this.numCards= {};
      this.coinDict= {};
      this.inGame= false;
      this.winner= "";
    },
    playerText: function(player){
      if(this.inGame && !this.deadPlayers.includes(player)){
        return "Coins: " + this.coinDict[player] + ", Cards in Hand: " + this.numCards[player];
      }else if(this.inGame && this.deadPlayers.includes(player)){
        return "Dead";
      }else{
        return "Ready";
      }
    },
    bgVariant: function(index){
      if(!this.inGame){
        return this.username===this.players[index]? 'secondary':'light';
      }else{
        if(this.deadPlayers.includes(this.players[index])){
          return 'dark';
        }
        return index===this.playerIndex? 'info':'light';
      }
    },
    textVariant: function(index){
      if(!this.inGame){
        return this.username===this.players[index]? 'white':'';
      }else{
        if(this.deadPlayers.includes(this.players[index])){
          return 'white';
        }
        return index===this.playerIndex? 'white':'';
      }
    },
    leave: function(username){
      axios.delete('/api/room/players/'+this.roomID, {})
      .then((res) => {
        let user = this.username !== null? this.username: username;
        eventBus.$emit("add-message", {"message": user + " left the room.", "roomID": this.roomID});
        socket.emit("leave",res.data);
        eventBus.$emit('left-room');
      })
    },
    start: function(){
      this.loading = true;
      socket.emit("loading", {"roomID":this.roomID});
      eventBus.$emit("add-message", {"message": "Game started", "roomID": this.roomID});
      axios.put('/api/room/start/'+this.roomID, {})
      .then(() => {
        socket.emit("getInfo", {"roomID": this.roomID});
      });
    },
    end: function(){
      axios.put('/api/room/end/'+this.roomID, {})
      .then(() => {
        this.clear();
        eventBus.$emit("add-message", {"message": "Game ended", "roomID": this.roomID});
        socket.emit("ended", {"roomID": this.roomID});
        this.inGame = false;
      });
    },
    playSound: function(situation){
      var audio;
      if(situation === "WINNER"){ // of game
        let prob = Math.random();
        if(prob <= .2){
          audio = new Audio(require('./media/falconPunch.mp3'));
        }else if(prob <= .4){
          audio = new Audio(require('./media/finishHim.mp3'));
        }else if(prob <= .6){
          audio = new Audio(require('./media/pentakill.mp3'));
        }else if(prob <= .8){
          audio = new Audio(require('./media/victory.mp3'));
        }else{
          audio = new Audio(require('./media/kamehameha.mp3'));
        }
      }else if(situation === "LOSER"){ // of game
        let prob = Math.random();
        if(prob <= .15){
          audio = new Audio(require('./media/smashDeath.mp3'));
        }else if(prob <= .3){
          audio = new Audio(require('./media/snake.mp3'));
        }else if(prob <= .45){
          audio = new Audio(require('./media/tbdJoJo.mp3'));
        }else if(prob <= .6){
          audio = new Audio(require('./media/fatality.mp3'));
        }else if(prob <= .75){
          audio = new Audio(require('./media/defeat.mp3'));
        }else if(prob <= .9){
          audio = new Audio(require('./media/noob.mp3'));
        }else{
          audio = new Audio(require('./media/omae.mp3'));
        }
      }
      audio.play();
    }
  }
}
</script>

<style scoped>
.wait{
  display: flex;
  flex-direction: column;
}

.players{
  display: flex;
  flex-direction: row;
}

.columns{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
