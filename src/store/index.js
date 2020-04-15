import Vue from 'vue'
import Vuex from 'vuex'
import Socket from './socket'
import vm from '../main'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    socket: Socket
  },
  state: {
    name: '',
    lobby: '',
    zar: '',
    host: '',
    gameState: 'Home', // Home, Lobby, Game
    endLobby: false,
    blackCard: undefined,
    revealed: {},
    tempIds: {},
    hands: [],
    users: [],
    error: ''
  },
  mutations: {
  },
  actions: {
    join_lobby ({ state }) {
      vm.$socket.emit('join', { name: state.name, lobby: state.lobby }, (response) => {
        if (response.error) {
          console.error(response.error)
          state.error = response.error
          return
        }

        state.gameState = 'Lobby'
        state.users = response.players
        state.host = response.host

        vm.$router.push(`/lobby/${state.lobby}`)
      })
    },
    start_game ({ state }) {
      vm.$socket.emit('start_game', (response) => {
        if (response && response.error) console.error(response.error)
      })
    },
    place_cards ({ state }, cards) {
      console.log('Cards: ', cards)

      vm.$socket.emit('place_cards', cards, (response) => {
        if (response && response.error) console.error(response.error)
      })
    },
    reveal_cards ({ state }, pos) {
      vm.$socket.emit('reveal', pos, (response) => {
        if (response && response.error) {
          console.error(response.error)
        }
      })
    },
    winner ({ state }, pos) {
      console.log('Winner: ', pos)

      vm.$socket.emit('winner_selected', state.tempIds[pos], (response) => {
        if (response && response.error) {
          console.error(response.error)
        }
      })
    },
    leave_lobby ({ state }) {
      vm.$socket.emit('leave', name)
    },
    change_card_deck ({ state }, deck) {
      vm.$socket.emit('change_deck', deck)
    }
  },
  getters: {
    allPlaced (state) {
      return Object.values(state.users.filter(u => u.placed)).length === state.users.length - 1
    },
    allRevealed (state) {
      return Object.values(state.revealed).length === state.users.length - 1
    }
  }
})
