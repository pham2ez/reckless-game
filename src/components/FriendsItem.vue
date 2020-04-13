<template>
  <div class="friend">
    <b-card
    :title="username">
      <b-card-text>
        {{showStatus}}
      </b-card-text>

      <b-button v-if="status === 'room'" variant="primary"> Join </b-button>
      <b-button v-if="mode===1" v-on:click='accept()' variant="primary"> Accept </b-button>
      <b-button v-if="mode===1" v-on:click='reject()' variant="primary"> Delete </b-button>
      <b-button v-if="mode===2" v-on:click='request()' variant="primary"> Request </b-button>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: 'FriendsItem',
  props: ["username","mode","status","roomID"],
  created: function(){
  },
  computed: {
    showStatus: function(){
      if(this.status === 'room'){
        return "Waiting";
      }else if(this.status === 'game'){
        return "In game";
      }
    }
  },
  methods: {
    join: function(){
      axios.put('/api/room/players/'+this.roomID, {})
      .then((res) => {
        eventBus.$emit('joined-room', res.data);
      })
    },
    accept: function(){
      axios.put('/api/user/request/'+this.username, {})
      .then(() => {
        eventBus.$emit('update-requests');
      })
    },
    reject: function(){
      axios.delete('/api/user/request/'+this.username, {})
      .then(() => {
        eventBus.$emit('update-requests');
      })
    },
    request: function(){
      axios.post('/api/user/request/'+this.username, {})
      .then(() => {
        eventBus.$emit('friend-requested');
      });
    },
  }
}
</script>

<style scoped>
</style>
