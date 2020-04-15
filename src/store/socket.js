import vm from '../main'
import Events from '../events'

export default {
  mutations: {
    SOCKET_answer (context, data) {
      console.log('Got Answer!')
    },
    SOCKET_connect (context, data) {
      console.log('Connected ')
    },
    SOCKET_disconnect (context, data) {
      console.log('Disconnected', data)
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
      this.state.blackCard = black
      this.state.zar = zar
      vm.$router.push('/game/' + this.state.lobby)
    },
    SOCKET_next_round (context, { hand, black, zar, winner }) {
      this.state.hands = hand
      this.state.blackCard = black
      this.state.zar = zar
      this.state.revealed = {}
      this.state.tempIds = {}

      this.state.users.forEach((user, index) => {
        vm.$set(this.state.users[index], 'placed', false)
        if (user.name === winner) vm.$set(this.state.users[index], 'points', user.points + 1)
      })
    },
    SOCKET_game_end (context, points) {
      this.state.hands = []
      this.state.blackCard = undefined
      this.state.zar = undefined
      this.state.revealed = {}
      this.state.tempIds = {}

      this.state.users.forEach((user, index) => {
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
      Events.$emit('rotate_' + pos)
      vm.$set(this.state.revealed, pos, cards)
      vm.$set(this.state.tempIds, pos, tempId)
    },
    SOCKET_winner (context, data) {

    },
    SOCKET_deck_change (context, data) {

    }
  }
}
