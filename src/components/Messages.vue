<template>
  <div class="messageBox">
    <div id="textarea" style="border-style: solid 5px; box-shadow: 0 0 10px #719ECE; border-color:#00cdcd;
      height: 500px; overflow: auto; width: 100%; font-size: 15px; font-weight: bold; font-family: 'Arial';">
      <div v-for="(msg,index) in messages" :key="index" :style="'color:' + msg.color">
        {{msg.message}}
      </div>
    </div>
    <b-form-textarea
      id="textarea"
      v-model="message"
      v-on:keyup.enter="sendMessage"
      placeholder="Send message to room..."
      rows="1"
      no-resize/>
    <!-- <b-form-textarea
      id="textarea" v-model="messages" rows="26" plaintext no-resize
      style="border-style: solid 5px; box-shadow: 0 0 10px #719ECE; border-color:#00cdcd;
      font-size: 15px; font-weight: bold; font-family: 'Arial';" /> -->
  </div>
</template>

<script>
import { eventBus, socket } from "../main";

export default {
  name: 'Messages',
  props: ["roomID","username"],
  data() {
    return {
      // messages: ""
      messages: [],
      message: ""
    }
  },
  created: function(){
    eventBus.$on("add-message",(req)=>{
      // this.messages += "- " + req.message + "\n";
      this.messages.push(req);
      this.updateScrollHeight();
      socket.emit("message", req);
    });

    eventBus.$on("left-room",()=>{
      // this.messages = "";
      this.messages = [];
    });

    socket.on("message",data => {
      // this.messages += "- " + data.message + "\n";
      this.messages.push(data);
      this.updateScrollHeight();
    });
  },
  methods: {
    updateScrollHeight: function(){
      this.$nextTick(function () {
        document.getElementById('textarea').scrollTop = document.getElementById('textarea').scrollHeight;
      });
    },
    sendMessage: function(){
      if(this.message.replace(/\s/g, '').length){

// eslint-disable-next-line no-console
        console.log(this.message);
        eventBus.$emit("add-message",{"message": this.username + ": " + this.message, "roomID": this.roomID});
        this.message = "";
      }else{
        this.message = "";
      }
    }
  }
}
</script>

<style scoped>
.messageBox{
  display: flex;
  flex-direction: column;
  width: 30%;
  height: 500px;
}
</style>