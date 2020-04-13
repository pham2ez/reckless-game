<template>
  <div class="wait">
    <h2>{{roomName}}</h2>
    {{players.length}}/6 players
    <div class="players">
      <b-card
      v-for="i in players.length"
      v-bind:key="players[i-1]"
      :title="players[i-1]"
      :bg-variant="username===players[i-1]?'info':'light'">
        <b-card-text>
          {{playerText(players[i-1])}}
        </b-card-text>
      </b-card>
    </div>
    <div v-show="!inGame && !loading" class="buttons">
      <b-button :disabled="username !== creator || players.length<2" @click="start">Start</b-button>
      <b-button @click="leave">Leave</b-button>
    </div>
    <b-spinner v-show="loading" variant="primary" label="Spinning"></b-spinner>
    <div v-show="inGame">
      <div class="info">
        {{deadCardsText}}
        <b-button v-show="inGame" v-b-modal="'info'">Info</b-button>
        <!-- The modal -->
        <b-modal id="info" size="lg" title="Coup Actions" hide-footer>
          <b-img :src="require('./media/rules.png')" fluid-grow></b-img>
        </b-modal>
      </div>
      <b-modal :visible="inGame && winner !== ''" hide-header hide-footer>
        The winner is {{winner}}.
        <b-button v-if="creator===username" @click="end">End</b-button>
      </b-modal>
    </div>

      <div class="columns">
        <Messages v-bind:roomID="roomID"/>
        <CoupView v-if="!dead"
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
      deadCards: {},
      deadPlayers: [],
      numCards: {},
      coinDict: {},
      inGame: false,
      winner: "",
      
      loading: false,
      dict: {"A1":"Ambassador", "C":"Contessa", "T":"Captain", "D":"Duke", "N":"Assassin"}
    }
  },
  created: function(){
    socket.on('join', (data) => {
      if(data.id == this.roomID){
        this.players = data.players;
      }
    });
    socket.on('leave', (data) => {
      if(data.id == this.roomID){
        this.players = data.players;
        this.creator = data.creator;
      }
    });
    socket.on("ended",()=>{
      this.clear();
    });
    socket.on("winner",(data)=>{
      this.winner = data;
    });
    eventBus.$on("joined-room", (res) => {
      this.creator = res.creator;
      this.players = res.players;
      this.roomID = res.id;
      this.roomName = res.roomName;
    });
    eventBus.$on("leave-room", () => {
      this.leave();
    });

    eventBus.$on("leave-room", () => {
      this.leave();
    });

    eventBus.$on("game-info", (req) => {
      this.loading = false;
      this.deadPlayers = req.deadPlayers;
      this.dead = req.deadPlayers.includes(this.username);
      this.deadCards = req.deadCards;
      this.numCards = req.numCards;
      this.coinDict = req.coinDict;
      this.inGame = true;
      if(req.deadPlayers.length === this.players.length-1){
        for(let i of this.players){
          if(!this.deadPlayers.includes(i)){
            this.winner = i;
            break;
          }
        }
        socket.emit("winner",this.winner);
      }
    });
    
    socket.on("started", () => {
      this.inGame = true;
    });

    socket.on("loading", () => {
      this.loading = true;
    });
  },
  computed: {
    
    deadCardsText: function(){
      let str = "";
      for(let key in this.deadCards){
        str += this.dict[key] + ": " + this.deadCards[key] + "/3";
        if(key !==  "D"){str += "\n"}
      }
      return str;
    }
  },
  methods: {
    clear: function(){
      this.dead= false;
      this.deadCards= {};
      this.deadPlayers= [];
      this.numCards= {};
      this.coinDict= {};
      this.inGame= false;
      this.winner= "";
    },
    playerText: function(player){
      if(this.inGame && !this.deadPlayers.includes(player)){
        return "Coins: " + this.coinDict[player] + "\nCards in Hand: " + this.numCards[player];
      }else if(this.inGame && this.deadPlayers.includes(player)){
        return "Dead";
      }else{
        return "Ready";
      }
    },
    leave: function(){
      axios.delete('/api/room/players/'+this.roomID, {})
      .then((res) => {
        eventBus.$emit("add-message", {"message": this.username + " left the room.", "roomID": this.roomID});
        socket.emit("leave",res.data);
        eventBus.$emit('left-room');
      })
    },
    start: function(){
      this.loading = true;
      socket.emit("loading");
      eventBus.$emit("add-message", {"message": "Game started", "roomID": this.roomID});
      axios.put('/api/room/start/'+this.roomID, {})
      .then(() => {
        socket.emit("getInfo");
      });
    },
    end: function(){
      axios.put('/api/room/end/'+this.roomID, {})
      .then(() => {
        this.clear();
        eventBus.$emit("ended");
        socket.emit("ended");
      });
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
