import Vue from 'vue'
import Vuex from 'vuex'
import Socket, { formatBlackCard } from './socket'
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
    posNames: {},
    hands: [],
    users: [],
    connected: false,
    winner: '',
    timer: 0,
    language: 'en'
  },
  mutations: {
    setLanguage (state, lang) {
      state.language = lang
    },
    setCardDecks (state, cardDecks) {
      state.cardDecks = cardDecks
    },
    resetLobby (state) {
      state.zar = ''
      state.host = ''
      state.handSize = 7
      state.pointsToWin = 5
      state.cardDecks = ['Base']
      state.gameState = 'Home'
      state.endLobby = false
      state.blackCard = undefined
      state.revealed = {}
      state.posNames = {}
      state.hands = []
      state.users = []
      state.winner = ''
      state.language = 'en'
    }
  },
  actions: {
    join_lobby ({ state }) {
      vm.$socket.emit('join', { name: state.name, lobby: state.lobby }, (response) => {
        if (handleResponse(response)) return

        console.log(response)

        state.users = response.players
        state.host = response.host
        state.handSize = response.hand_size
        state.cardDecks = response.card_decks
        state.pointsToWin = response.points_to_win
        state.language = response.language

        if (response.hand) {
          state.gameState = 'Game'
          state.hands = response.hand
          state.blackCard = formatBlackCard(response.black)
          state.zar = response.zar
          state.revealed = response.revealed

          vm.$router.push(`/game/${state.lobby}`)
        } else {
          state.gameState = 'Lobby'
          vm.$router.push(`/lobby/${state.lobby}`)
        }
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

      vm.$socket.emit('winner_selected', pos, (response) => {
        handleResponse(response)
      })
    },
    leave_game ({ state, commit }) {
      commit('resetLobby')
      vm.$router.push('/')
      vm.$socket.emit('leave')
    },
    change_settings ({ state }, settings) {
      vm.$socket.emit('change_settings', settings, (response) => {
        handleResponse(response)
      })
    },
    delete_card ({ state }, card) {
      vm.$socket.emit('delete_card', card, (response) => {
        if (!handleResponse(response)) {
          state.hands = state.hands.filter(c => c !== card)
        }
      })
    }
  },
  getters: {
    allPlaced (state) {
      const users = state.users.filter(u => u.connected)
      return Object.values(users.filter(u => u.placed)).length === users.length - 1
    },
    allRevealed (state) {
      const users = state.users.filter(u => u.connected)
      return Object.values(state.revealed).length === users.length - 1
    },
    connectedUsers (state) {
      return state.users.filter(u => u.connected)
    },
    disconnectedUsers (state) {
      return state.users.filter(u => !u.connected)
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
