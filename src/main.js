import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store'
import './components.js'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://217.160.171.237:80',
  // connection: 'http://192.168.0.20:5000',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
  // options: { path: '/my-app/' } // Optional options
}))

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
