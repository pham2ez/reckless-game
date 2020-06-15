<template>
  <div class="gamesList">
    <div class="searchResults" v-if="searching">
      <h1> Search Results </h1>
      <b-card
        v-if="searchList.length === 0"
        title="No rooms with this name/ID #."
        style="text-align:center;"
        class="mb-2"/>
      <GameItem
        v-for="game in searchList"
        v-bind:key="game.id"
        v-bind:roomName="game.roomName"
        v-bind:roomID="game.id"
        v-bind:players="game.players"
        v-bind:inGame="game.inGame"
        v-bind:existsPassword="game.existsPassword"/>
    </div>
    <b-tabs content-class="mt-2" v-else justified>
      <b-tab title="All Games" active>
        <b-card
        v-if="gameList.length === 0"
        title="No games currently created."
        style="text-align:center;"
        class="mb-2"/>
        <GameItem
        v-for="game in gameList"
        v-bind:key="game.id"
        v-bind:roomName="game.roomName"
        v-bind:roomID="game.id"
        v-bind:players="game.players"
        v-bind:inGame="game.inGame"
        v-bind:existsPassword="game.existsPassword"/>
      </b-tab>
      <b-tab title="Available Games">
        <b-card
        v-if="gameList.length === 0"
        title="No games currently created."
        style="text-align:center;"
        class="mb-2"/>
        <b-card
        v-if="gameList.length !== 0 && availableList.length === 0"
        title="All rooms are currently in game."
        style="text-align:center;"
        class="mb-2"/>
        <GameItem
        v-for="game in availableList"
        v-bind:key="game.id"
        v-bind:roomName="game.roomName"
        v-bind:roomID="game.id"
        v-bind:players="game.players"
        v-bind:inGame="game.inGame"
        v-bind:existsPassword="game.existsPassword"/>
      </b-tab>
    </b-tabs>
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
      gameList: [],
      searchList: [],
      searching: false,
      availableList: []
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
        this.searching = false;
        this.searchList = [];
      }else{
        this.searching = true;
        axios.get('/api/room/find/'+req, {})
        .then((res) => {
          this.searchList = res.data;
        });
      }
    });
  },
  methods: {
    getRooms: function(){ // TODO specific getRoom info
      axios.get('/api/room/rooms', {})
      .then((res) => {
        this.gameList = res.data[0];
        this.availableList = res.data[1];
      });
    }
  }
}
</script>

<style scoped>
</style>
