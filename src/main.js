import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import io from 'socket.io-client';
export const socket = io('http://localhost:3000');

// Install BootstrapVue
Vue.use(BootstrapVue);

export const eventBus = new Vue();

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
