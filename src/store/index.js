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
    handSize: 7,
    pointsToWin: 5,
    cardDecks: ['Base'],
    gameState: 'Home', // Home, Lobby, Game
    endLobby: false,
    blackCard: undefined,
    revealed: {},
    tempIds: {},
    tempToUser: {},
    hands: [],
    users: [],
    connected: false,
    winner: '',
    timer: 0
  },
  mutations: {
  },
  actions: {
    join_lobby ({ state }) {
      vm.$socket.emit('join', { name: state.name, lobby: state.lobby }, (response) => {
        if (handleResponse(response)) return

        state.gameState = 'Lobby'
        state.users = response.players
        state.host = response.host
        state.handSize = response.hand_size
        state.cardDecks = response.card_decks
        state.pointsToWin = response.points_to_win

        vm.$router.push(`/lobby/${state.lobby}`)
      })
    },
    start_game ({ state }) {
      vm.$socket.emit('start_game', (response) => {
        handleResponse(response)
      })
    },
    place_cards ({ state }, cards) {
      console.log('Cards: ', cards)

      vm.$socket.emit('place_cards', cards, (response) => {
        handleResponse(response)
      })
    },
    reveal_cards ({ state }, pos) {
      vm.$set(state.revealed, pos, [])

      vm.$socket.emit('reveal', pos, (response) => {
        handleResponse(response)
      })
    },
    winner ({ state }, pos) {
      console.log('Winner: ', pos)

      vm.$socket.emit('winner_selected', state.tempIds[pos], (response) => {
        handleResponse(response)
      })
    },
    leave_lobby ({ state }) {
      vm.$socket.emit('leave', name)
    },
    change_settings ({ state }, settings) {
      vm.$socket.emit('change_settings', settings, (response) => {
        handleResponse(response)
      })
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

function handleResponse (response) {
  if (!response) return false
  if (response.error) {
    console.error(response.error)
    vm.$root.$emit('error', response.error)
    return true
  }
  if (response.info) {
    console.info(response.info)
    vm.$root.$emit('info', response.info)
  }
  return false
}
