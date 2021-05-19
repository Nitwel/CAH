import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store'
import './components.js'
import './registerServiceWorker'
import VueSocketIO from 'vue-socket.io'

const options = {
  debug: true,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}

if (process.env.NODE_ENV === 'development') {
  options.connection = '192.168.0.20:5000'
} else {
  options.connection = 'https://playcah.de:5000'
}

Vue.use(new VueSocketIO(options))

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
