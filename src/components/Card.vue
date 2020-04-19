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
  name: 'CoupView',
  props: ["role", "available"],
  data() {
    return {
      hover: false,
      textArray: []
    }
  },
  created: function(){
    if(this.role === "A1"){
      this.textArray = ["Exchange cards with Court Deck.","Blocks stealing."];
    }else if(this.role === "C"){
      this.textArray = [ "Blocks assassination."];
    }else if(this.role === "D"){
      this.textArray = [ "Take 3 coins from Treasury.","Blocks Foreign Aid."];
    }else if(this.role === "N"){
      this.textArray = [ "Pay 3 coins to assassinate another player."];
    }else if (this.role === "T"){
      this.textArray = [ "Steal 2 coins from another player.","Blocks stealing."];
    }
  },
  computed: {
    title: function(){
      if(this.role === "A1"){
        return "Ambassador";
      }else if(this.role === "C"){
        return "Contessa";
      }else if(this.role === "D"){
        return "Duke";
      }else if(this.role === "N"){
        return "Assassin";
      }else if (this.role === "T"){
        return "Captain";
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
        return require('./media/Ambassador.jpg');
      }else if(this.role === "C"){
        return require('./media/Contessa.png');
      }else if(this.role === "D"){
        return require('./media/Duke.png');
      }else if(this.role === "N"){
        return require('./media/Assassin.png');
      }else if (this.role === "T"){
        return require('./media/Captain.jpg');
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
