<template>
  <div class="game">
    <b-card :title="roomName">
      <b-card-text>
        ID: {{roomID}}  <br/>
        Players: {{players}}
      </b-card-text>
      <b-button variant="primary" v-show="players.length < 6 && !inGame" @click="check">Join</b-button>
    </b-card>

    <b-modal v-model="show" :title="'Enter password for room ID ' + roomID" hide-footer @show="resetModal" >
      <b-alert :show="wrongAttempt" dismissible variant="danger">Wrong password entered. Please try again.</b-alert>
        <b-spinner v-show="checking" variant="primary" label="Spinning"></b-spinner>
        <div :show="!checking" class="actions">
          Password: <input type="password"
          v-model="passwordAttempt"/>
          <b-button :disabled="passwordAttempt === ''" @click="checkPassword">Join</b-button>
        </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus, socket } from "../main";

export default {
  name: 'GameItem',
  props: ["roomName","roomID","players","inGame","existsPassword"],
  data() {
    return {
      show: false,
      passwordAttempt: "",
      wrongAttempt: false,
      checking: false
    }
  },
  methods: {
    resetModal: function(){
      this.wrongAttempt = false;
      this.checking = false;
      this.passwordAttempt = "";
    },
    check: function(){
      if(this.existsPassword){
        this.show = !this.show;
      }else{
        this.join();
      }
    },
    checkPassword: function(){
      this.checking = true;
      axios.put('/api/room/password/'+this.roomID, {passwordAttempt: this.passwordAttempt})
        .then((res) => {
          this.populate(res);
        })
        .catch(() =>{
          this.checking = false;
          this.wrongAttempt = true;
          this.passwordAttempt = "";
        });
    },
    join: function(){
      axios.put('/api/room/players/'+this.roomID, {})
      .then((res) => {
        this.populate(res);
      })
    },
    populate: function(res){
      socket.emit("join",{"roomID":this.roomID, "players":res.data.players});
      eventBus.$emit('joined-room', res.data);
    }
  }
}
</script>

<style scoped>
</style>
