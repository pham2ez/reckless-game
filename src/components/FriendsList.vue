<template>
  <div class="friendsList">
    <b-tabs content-class="mt-3" justified>
      <b-tab title="Friends" v-on:click="getFriends" active>
        <FriendsItem
          v-for="friend in show"
          v-bind:key="friend"
          v-bind:username="friend"
          v-bind:mode="0"/>
      </b-tab>
      <b-tab title="Requests" v-on:click="getRequests">
        <FriendsItem
          v-for="friend in show"
          v-bind:key="friend"
          v-bind:username="friend"
          v-bind:mode="1"/>
      </b-tab>
      <b-tab title="Add" v-on:click="changeSearch" class="flex-container">
        <div class="container">
          <input type="text"
            class="small"
            v-model="search"
            v-on:input="changeSearch" 
            placeholder="Search user..."
          />
          <FriendsItem
            class="small"
            v-for="friend in show"
            v-bind:key="friend"
            v-bind:username="friend"
            v-bind:mode="2"/>
          </div>
      </b-tab>
    </b-tabs>
    <!-- TODO sort for friends in game or in a room-->
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";
import FriendsItem from './FriendsItem.vue';

export default {
  name: 'FriendsList',
  components: {
    FriendsItem
  },
  data() {
    return {
      mode: "friends",
      show: [],
      search: ""
    }
  },
  created: function(){
    this.getFriends();
    eventBus.$on("friend-requested", () => { // requested a friend, clear search
      this.search = "";
      this.show = [];
    });
    eventBus.$on("update-requests", () => { // accepted/rejected a friend, update list
      this.getRequests();
    });
  },
  methods: {
    getFriends: function(){
      this.search = "";
      axios.get('/api/user/friends', {})
      .then((res) => {
        this.show = res.data;
      });
    },
    getRequests: function(){
      this.search = "";
      axios.get('/api/user/request/', {})
      .then((res) => {
        this.show = res.data;
      });
    },
    changeSearch: function(){
      if(this.search === ""){
        this.show = [];
      }else{
        axios.get('/api/user/find/'+this.search, {})
        .then((res) => {
          this.show = res.data;
        });
      }
    }
  }
}
</script>

<style scoped>
.home{
  display:flex;
  flex-direction:column;
}
.small{
  width: 100%;
  font-size: 16px;
}
</style>
