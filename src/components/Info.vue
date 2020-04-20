<template>
  <b-card class="info" :title="title">
    <b-card-text v-for="(text, index) in textArray" v-bind:key="text + index">
      {{text}}
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  name: 'CoupView',
  props: ["title", "textArray"]
}
</script>

<style scoped>
.info{
  display: flex;
  flex-grow: 1;
}
</style>
