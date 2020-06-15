<template>
  <b-card
    :title="title" :style="style" :class="classType"
    img-top :img-src="img"
    @click="choose"
    @mouseover="onHover"
    @mouseout="onLeave">
    <b-card-text v-for="text in textArray" v-bind:key="text">
      {{text}}
    </b-card-text>
  </b-card>
</template>

<script>
import { eventBus } from "../main";

export default {
  name: 'Card',
  props: ["role", "available"],
  data() {
    return {
      hover: false,
      textArray: []
    }
  },
  created: function(){
    if(this.role === "A1"){
      this.textArray = ["Pick up 2 roles and choose 2 to keep.","Blocks Threaten action."];
    }else if(this.role === "C"){
      this.textArray = [ "Blocks Slay action."];
    }else if(this.role === "D"){
      this.textArray = [ "Take 3 gold pieces from the people.","Blocks Corrupt Income."];
    }else if(this.role === "N"){
      this.textArray = [ "Pay 3 gold pieces to slay another player."];
    }else if (this.role === "T"){
      this.textArray = [ "Threaten another player to get their 2 gold pieces.","Blocks Threaten action."];
    }
  },
  computed: {
    title: function(){
      if(this.role === "A1"){
        return "Spy";
      }else if(this.role === "C"){
        return "Rogue";
      }else if(this.role === "D"){
        return "King";
      }else if(this.role === "N"){
        return "Samurai";
      }else if (this.role === "T"){
        return "Pirate";
      }
    },
    style: function(){
      if(this.hover){ // bigger if hovered over
        return "max-width: 15rem;";
      }else{
        return "max-width: 12rem";
      }
    },
    img: function(){
      if(this.role === "A1"){
        return require('./media/spy.jpg');
      }else if(this.role === "C"){
        return require('./media/rogue.jpg');
      }else if(this.role === "D"){
        return require('./media/king.jpg');
      }else if(this.role === "N"){
        return require('./media/samurai.jpg');
      }else if (this.role === "T"){
        return require('./media/pirate.jpg');
      }
    },
    classType: function(){
      if(!this.available){
        return "dark";
      }else{
        return "";
      }
    }
  },
  methods: {
    choose: function(){
      if(this.available){
        eventBus.$emit("chosen-card",this.role);
      }
    },
    onHover: function(){
      this.hover = true;
    },
    onLeave: function(){
      this.hover = false;
    }
  }
}
</script>

<style scoped>
.dark{
  filter: brightness(75%);
}
</style>
