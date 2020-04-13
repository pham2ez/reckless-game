<template>
    <b-card
    :title="title"
    img-top
    :img-src="img"
    :style="style"
    :class="classy"
    @click="choose"
    @mouseover="onHover"
    @mouseout="onLeave">
    <b-card-text>
      {{info}}
    </b-card-text>
  </b-card>
</template>

<script>
// import axios from "axios";
import { eventBus } from "../main";

// import image from "./media/Assassin.png";

export default {
  name: 'CoupView',
  props: ["role", "available"],
  data() {
    return {
      hover: false
    }
  },
  created: function(){
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
    info: function(){
      if(this.role === "A1"){
        return "Exchange cards with Court Deck.\nBlocks stealing.";
      }else if(this.role === "C"){
        return "Blocks assassination.";
      }else if(this.role === "D"){
        return "Take 3 coins from Treasury.\nBlocks Foreign Aid.";
      }else if(this.role === "N"){
        return "Pay 3 coins to assassinate another player.";
      }else if (this.role === "T"){
        return "Steal 2 coins from another player.\nBlocks stealing.";
      }
    },
    style: function(){
      if(this.hover){
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
    classy: function(){
      if(!this.available){
        return "dark";
      }else{
        return "";
      }
    }
  },
  methods: {
    choose: function(){
      if(!this.available){
        return;
      }
      eventBus.$emit("chosen-card",this.role);
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
