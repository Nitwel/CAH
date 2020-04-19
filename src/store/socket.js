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

      if (['Lobby', 'Game'].includes(this.state.gameState)) {
        vm.$router.push('/lobby/' + this.state.lobby)
      } else {
        vm.$router.push('/')
      }

      vm.$root.$emit('error', 'Disconnected from server')
      console.error('Disconnected')
    },
    SOCKET_player_join (context, player) {
      if (!this.state.users.find(u => u.name === player.name)) {
        this.state.users.push({ name: player.name, placed: false, points: 0 })
        console.log(`Player ${player.name} has joined`)
      }
    },
    SOCKET_player_leave (context, player) {
      this.state.users = this.state.users.filter(p => p.name !== player)
      console.log(`Player ${player} has left`)
    },
    SOCKET_game_start (context, { hand, black, zar }) {
      this.state.gameState = 'Game'
      this.state.hands = hand
      this.state.blackCard = formatBlackCard(black)
      this.state.zar = zar
      vm.$router.push('/game/' + this.state.lobby)
    },
    async SOCKET_next_round (context, { hand, black, zar, winner, tempIds }) {
      this.state.tempToUser = tempIds
      this.state.winner = winner
      this.state.timer = 11

      this.state.users.forEach((user, index) => {
        if (user.name === winner) vm.$set(this.state.users[index], 'points', user.points + 1)
      })

      while (this.state.timer > 0) {
        this.state.timer -= 1
        await timeout(1000)
      }

      this.state.hands = hand
      this.state.blackCard = formatBlackCard(black)
      this.state.zar = zar
      this.state.revealed = {}
      this.state.tempIds = {}
      this.state.tempToUser = {}
      this.state.winner = ''

      this.state.users.forEach((user, index) => {
        vm.$set(this.state.users[index], 'placed', false)
      })
    },
    SOCKET_game_end (context, points) {
      this.state.hands = []
      this.state.blackCard = undefined
      this.state.zar = undefined
      this.state.revealed = {}
      this.state.tempIds = {}
      this.tempToUser = {}
      this.state.winner = ''

      this.state.users.forEach((user, index) => {
        vm.$set(this.state.users[index], 'placed', false)
        vm.$set(this.state.users[index], 'points', points[user.name])
      })

      this.state.endLobby = true
      this.state.gameState = 'Lobby'
      vm.$router.push(`/lobby/${this.state.lobby}`)
    },
    SOCKET_cards_placed (context, name) {
      this.state.users.forEach((user, index) => {
        if (user.name === name) vm.$set(this.state.users[index], 'placed', true)
      })
    },
    SOCKET_cards_revealed (context, { pos, tempId, cards }) {
      var audio = new Audio('/sounds/reveal.mp3')
      audio.play()
      vm.$root.$emit('rotate_' + pos)
      vm.$set(this.state.revealed, pos, cards)
      vm.$set(this.state.tempIds, pos, tempId)
    },
    SOCKET_settings_changed (context, settings) {
      this.state.pointsToWin = settings.points_to_win
      this.state.handSize = settings.hand_size
      this.state.cardDecks = settings.card_decks
    },
    SOCKET_host (context, host) {
      this.state.host = host
    }
  }
}

function formatBlackCard (card) {
  card.text = card.text.replace(/_/g, '____')
  return card
}

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
