<template>
  <div class="gamesList">
    <GameItem
      v-for="game in gameList"
      v-bind:key="game.id"
      v-bind:roomName="game.roomName"
      v-bind:roomID="game.id"
      v-bind:players="game.players"/>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus,socket } from "../main";
import GameItem from './GameItem.vue';

export default {
  name: 'GamesList',
  components:{
    GameItem
  },
  data() {
    return {
      gameList: []
    }
  },
  created: function(){
    this.getRooms();

    socket.on('create', () => { // TODO add room to gamesList
      this.getRooms();
    });

    socket.on('join', () => { // TODO update only the room's players
      this.getRooms();
    });

    socket.on('leave', () => {
      this.getRooms();
    });

    eventBus.$on("search", (req) => {
      if(req === ""){
        this.getRooms();
      }else{
        axios.get('/api/room/find/'+req, {})
        .then((res) => {
          this.gameList = res.data;
        });
      }
    });
  },
  methods: {
    getRooms: function(){ // TODO specific getRoom info
      axios.get('/api/room/rooms', {})
      .then((res) => {
        this.gameList = res.data;
      });
    }
  }
}
</script>

<style scoped>
</style>
