<template>
  <div class="messageBox">
    <b-form-textarea
      id="textarea"
      v-model="messages"
      rows="26"
      plaintext
      no-resize
      style="border-style: solid 5px; box-shadow: 0 0 10px #719ECE;border-color:#00cdcd; font-size: 15px; font-weight: bold; font-family: 'Arial';"
    ></b-form-textarea>
  </div>
</template>

<script>
// import axios from "axios";
import { eventBus, socket } from "../main";

export default {
  name: 'Messages',
  props: ["roomID"],
  data() {
    return {
      messages: ""
    }
  },
  created: function(){
    this.messages = "Welcome to room " + this.roomID;
    eventBus.$on("add-message",(req)=>{
      this.messages += "\n- " + req.message;
      document.getElementById('textarea').scrollTop = document.getElementById('textarea').scrollHeight;
      socket.emit("message", req);
    });

    eventBus.$on("left-room",()=>{
      this.messages = "";
    });

    socket.on("message",data => {
      this.messages += "\n- " + data.message;
      this.$nextTick(function () {
        document.getElementById('textarea').scrollTop = document.getElementById('textarea').scrollHeight;
      })
    });
  }
}
</script>

<style scoped>

.messageBox{
  display: flex;
  width: 30%;
}
</style>