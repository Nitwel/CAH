import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Lobby from './views/Lobby.vue'
import Game from './views/Game.vue'
import Profile from './views/Profile.vue'
import store from './store'

Vue.use(VueRouter)

function reroute (to, from, next) {
  if (to.name === store.state.gameState) {
    next()
  } else {
    if (['Lobby', 'Game'].includes(to.name) && to.params.name) {
      store.state.lobby = to.params.name
    }
    next('/')
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/lobby/:name',
    name: 'Lobby',
    beforeEnter: reroute,
    component: Lobby,
    props: true

  },
  {
    path: '/game/:name',
    name: 'Game',
    beforeEnter: reroute,
    component: Game,
    props: true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = new VueRouter({
  routes
})

export default router
