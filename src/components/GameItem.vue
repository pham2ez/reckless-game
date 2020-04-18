<template>
  <div class="game">
    <b-card
    :title="roomName">
      <b-card-text>
        ID: {{roomID}}  <br />
        Players: {{players}}
      </b-card-text>
      <b-button variant="primary" @click="join">Join</b-button>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus, socket } from "../main";

export default {
  name: 'GameItem',
  props: ["roomName","roomID","players"],
  data() {
    return {
    }
  },
  created: function(){
  },
  computed: {
  },
  methods: {
    join: function(){
      
      axios.put('/api/room/players/'+this.roomID, {})
      .then((res) => {
        socket.emit("join",{"roomID":this.roomID, "players":res.data.players});
        eventBus.$emit('joined-room', res.data);
      })
    },
  }
}
</script>

<style scoped>
</style>
