<template>
  <div id="app">
    <b-navbar type="dark" variant="info">
      <b-navbar-brand href="#">Coup</b-navbar-brand>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="signedin && !inRoom" >
          <b-form-input size="sm" class="mr-sm-2" v-model="search" 
            v-on:input="changeSearch" placeholder="Search Room..."></b-form-input>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" v-if="signedin" >
          <b-button v-if="!inRoom" v-b-modal.my-modal>Create a Room</b-button>
          <b-nav-item v-if="!inGame" href="#" @click="signOut">Sign Out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal id="my-modal" title="Create a Room" @ok="createRoom">
      <input type="text"
        v-model="roomName"
        placeholder="Enter a room name"/>
    </b-modal>

    <div class="home" v-if="signedin && !inRoom">
      <div class="big">
        <GamesList/>
      </div>
      <div class="small">
        <FriendsList/>
      </div>
    </div>

    <SignUpIn v-if="!signedin"/>

    <WaitRoomView v-show="signedin && inRoom"
      v-bind:username="username"/>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus, socket } from "./main";
import SignUpIn from './components/SignUpIn.vue';
import FriendsList from './components/FriendsList.vue';
import GamesList from './components/GamesList.vue';
import WaitRoomView from './components/WaitRoomView.vue';

export default {
  name: 'app',
  components: {
    SignUpIn, FriendsList, GamesList, WaitRoomView
  },
  data() {
    return { 
      username: null,
      roomName: "",
      search: "",
      roomID: null,
      inRoom: false,
      inGame: false
    };
  },
  computed: {
    signedin: function(){
      return this.username !== null;
    }
  },
  methods: {
    signOut: function(){
      if(this.roomID !== null){ // leave room during signout
        eventBus.$emit("leave-room",this.username);
      }
      axios.delete('/api/user/signout', {})
      .then(() => {
        this.username = null;
      });
      socket.emit("loggedOut", this.roomID !== null? this.roomID: null); // no more create room updates
    },
    createRoom: function(){
      axios.post('/api/room', {content: this.roomName})
      .then((res) => {
        eventBus.$emit("joined-room",res.data);
        socket.emit('create',res.data);
        this.roomName = "";
      })
    },
    changeSearch: function(){
      eventBus.$emit("search",this.search);
    }
  },
  created: function() {
    axios.get('/api/user/signedin') // check is user is signed in or not
    .then((res)=>{
      eventBus.$emit("signin-success", res.data);
      if(res.data.gameInfo !== undefined){
        this.roomID = res.data.roomInfo.id;
        this.inRoom = true;
      }
    })
    .catch(()=>{
      eventBus.$emit("signin-success", {"username": null})
    });

    eventBus.$on("joined-room", (req) => {
      this.roomID = req.id;
      this.inRoom = true;
      eventBus.$emit("add-message", {"message": this.username + " joined the room.", "roomID": this.roomID});
    });

    eventBus.$on("left-room", () => {
      this.roomID = null;
      this.inRoom = false;
    });

    eventBus.$on("signin-success", (res) => {
      this.username = res.username;
      socket.emit("loggedIn",res.roomInfo === undefined? null: res.roomInfo.id);
    });
  }
}
</script>

<style scoped>
.home{
  display:flex;
  flex-direction:row;
}
.small{
  flex-grow: 1;
}
.big{
  flex-grow: 3;
}
</style>