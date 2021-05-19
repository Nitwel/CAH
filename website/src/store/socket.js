import vm from '../main'

export default {
  mutations: {
    SOCKET_answer (context, data) {
      console.log('Got Answer!')
    },
    SOCKET_connect (context, data) {
      this.state.connected = true
      console.log('Connected')
    },
    SOCKET_disconnect (context, data) {
      this.state.connected = false
      this.state.gameState = 'Home'
      this.commit('resetLobby')

      if (['Lobby', 'Game'].includes(this.state.gameState)) {
        vm.$router.push('/lobby/' + this.state.lobby)
      } else {
        vm.$router.push('/')
      }

      vm.$root.$emit('error', 'Disconnected from server')
      console.error('Disconnected')
    },
    SOCKET_player_join (context, player) {
      const index = this.state.users.findIndex(u => u.name === player.name)

      if (index === -1) {
        this.state.users.push({ name: player.name, placed: false, points: 0, connected: true })
        console.log(`Player ${player.name} has joined`)
        vm.$root.$emit('player_join', player)
      } else {
        vm.$set(this.state.users[index], 'connected', true)
        vm.$root.$emit('player_connect', player)
      }
    },
    SOCKET_player_leave (context, player) {
      const index = this.state.users.findIndex(u => u.name === player)

      if (this.state.gameState === 'Game') {
        vm.$set(this.state.users[index], 'connected', false)
        vm.$root.$emit('player_disconnect', player)
      } else {
        this.state.users = this.state.users.filter(p => p.name !== player)
        console.log(`Player ${player} has left`)
        vm.$root.$emit('player_leave', player)
      }
    },
    SOCKET_game_start (context, { hand, black, zar }) {
      this.state.gameState = 'Game'
      vm.$root.$emit('game_start', { hand, black, zar })

      this.state.users.forEach((user, index) => {
        vm.$set(this.state.users[index], 'points', 0)
      })

      this.state.hands = hand
      this.state.blackCard = formatBlackCard(black)
      this.state.zar = zar
      vm.$router.push('/game/' + this.state.lobby)
    },
    async SOCKET_next_round (context, { hand, black, zar, winner, pos }) {
      vm.$root.$emit('next_round', { hand, black, zar, winner, pos })

      this.state.posNames = pos
      this.state.winner = winner
      this.state.timer = 10

      this.state.users.forEach((user, index) => {
        if (user.name === winner) vm.$set(this.state.users[index], 'points', user.points + 1)
      })

      while (this.state.timer > 0) {
        await timeout(1000)
        this.state.timer -= 1
      }

      this.state.hands = hand
      this.state.blackCard = formatBlackCard(black)
      this.state.zar = zar
      this.state.revealed = {}
      this.state.posNames = {}
      this.state.winner = ''

      this.state.users.forEach((user, index) => {
        vm.$set(this.state.users[index], 'placed', false)
      })
    },
    SOCKET_game_end (context, points) {
      vm.$root.$emit('game_end', points)
      this.state.hands = []
      this.state.blackCard = undefined
      this.state.zar = undefined
      this.state.revealed = {}
      this.posNames = {}
      this.state.winner = ''

      this.state.users = this.state.users.filter(u => u.connected)

      this.state.users.forEach((user, index) => {
        vm.$set(this.state.users[index], 'placed', false)
        vm.$set(this.state.users[index], 'points', points[user.name])
      })

      this.state.endLobby = true
      this.state.gameState = 'Lobby'
      vm.$router.push(`/lobby/${this.state.lobby}`)
    },
    SOCKET_cards_placed (context, name) {
      vm.$root.$emit('cards_placed', name)
      this.state.users.forEach((user, index) => {
        if (user.name === name) vm.$set(this.state.users[index], 'placed', true)
      })
    },
    SOCKET_cards_revealed (context, { pos, cards }) {
      vm.$root.$emit('cards_revealed', { pos, cards })
      var audio = new Audio('/sounds/reveal.mp3')
      audio.play()
      vm.$root.$emit('rotate_' + pos)
      vm.$set(this.state.revealed, pos, cards)
    },
    SOCKET_settings_changed (context, settings) {
      vm.$root.$emit('settings_changed', settings)
      this.state.pointsToWin = settings.points_to_win
      this.state.handSize = settings.hand_size
      this.state.cardDecks = settings.card_decks
      this.state.language = settings.language
    },
    SOCKET_host (context, host) {
      vm.$root.$emit('host', host)
      this.state.host = host
    }
  }
}

export function formatBlackCard (card) {
  card.text = card.text.replace(/_/g, '____')
  return card
}

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
