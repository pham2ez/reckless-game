<template>
  <div id="sign">
    <b-tabs v-model="modeIndex" @input="clear()" content-class="mt-3" justified>
      <b-tab title="Sign In"></b-tab>
      <b-tab title="Sign Up" active></b-tab>
    </b-tabs>
    <form id="form" v-on:submit.prevent="submitThis" method="post">
      <div class="form-group">
        <h2>{{title}}</h2>
          <label for='username'>Username</label>
          <input id='username' type="text" v-model="username" :placeholder="[[ userPrompt ]]"/>
          <label for='password'>Password</label>
          <input id='password' type="text" v-model="password" :placeholder="[[ passPrompt ]]"/>
          <input type='submit' v-bind:value="title">
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: 'SignUpIn',
  data() {
    return {
      modeIndex: 0,
      options: ["signin","signup"],
      username: "",
      password: ""
    }
  },
  computed: {
    title: function(){
      if(this.modeIndex === 0){
        return "Sign In";
      }else if(this.modeIndex === 1){
        return "Sign Up";
      }
    },
    userPrompt: function(){
      if(this.modeIndex === 0){
        return "Enter your username";
      }else if(this.modeIndex === 1){
        return "Enter your password";
      }
    },
    passPrompt: function(){
      if(this.modeIndex === 0){
        return "Create a username";
      }else if(this.modeIndex === 1){
        return "Create a password";
      }
    }
  },
  methods: {
    submitThis: function(){
      if(this.modeIndex === 0){
        this.signIn();
      }else if(this.modeIndex === 1){
        this.signUp();
      }
    },
    clear: function(){
      this.username = "";
      this.password = "";
    },
    signIn: function(){
      const bodyContent = { username: this.username, password: this.password };
      axios.post('/api/user/signin', bodyContent)
      .then((res) => {
        eventBus.$emit('signin-success', res.data);
        this.clear();
      })
      .catch(err => {
        eventBus.$emit("error",err.response.data.error); // TODO alert/error
      });
    },
    signUp: function(){
      const bodyContent = { username: this.username, password: this.password };
      axios.post('/api/user', bodyContent)
      .then((res) => {
        eventBus.$emit('signin-success', res.data);
        this.clear();
      })
      .catch(err => {
        eventBus.$emit('error',err.response.data.error);
      });
    }
  }
}
</script>

<style>
.form-group{
  display:flex;
  flex-direction: column;
  font-size: 20px
}
input[type=submit]{
  height:30px;
  font-size:18px;
}
</style>
