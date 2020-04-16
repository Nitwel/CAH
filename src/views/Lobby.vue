<template>
  <div class="lobby">
    <div class="title">Lobby</div>
    <div class="users">
      <div class="user"  v-for="user in users" :key="user.name" >
        <User :name="user.name"/>
        <span v-if="endLobby && user.trophy" class="tropy material-icons" :class="user.trophy">emoji_events</span>
        <span class="points" v-if="endLobby">{{user.points}} Points</span>
      </div>
      <User v-if="!endLobby" name="invite" class="invite" invite></User>
    </div>
    <div class="settings" v-if="$store.state.host == $store.state.name">
      <label>Card decks</label>
      <multiselect v-model="selected" :options="card_decks" taggable multiple label="name" track-by="value">
        <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.name }}</strong></template>
      </multiselect>
      <label>Points to win</label>
      <input type="number" v-model="pointsToWin" name="points to win">
      <label>Hand size</label>
      <input type="number" v-model="handSize" name="points to win">
    </div>
    <div class="actions" v-if="$store.state.host == $store.state.name">
      <Button @click="saveSettings">Save Settings</Button>
      <Button @click="onClick">{{endLobby? "Next Round" : "Start"}}</Button>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect
  },
  name: 'Lobby',
  props: {
    name: {
      type: String
    }
  },
  data () {
    return {
      pointsToWin: 5,
      handSize: 7,
      selected: [{ name: 'Base', value: 'Base' }],
      card_decks: [
        { name: 'Base', value: 'Base' },
        { name: 'First Expansion', value: 'CAHe1' },
        { name: 'Second Expansion', value: 'CAHe2' },
        { name: 'Third Expansion', value: 'CAHe3' },
        { name: 'Fourth Expansion', value: 'CAHe4' },
        { name: 'Fifth Expansion', value: 'CAHe5' },
        { name: 'Sixth Expansion', value: 'CAHe6' },
        { name: 'Box Expansion', value: 'Box' },
        { name: 'Fantasy Pack', value: 'fantasy' },
        { name: 'Food Pack', value: 'food' },
        { name: 'Science Pack', value: 'science' },
        { name: 'World Wide Web Pack', value: 'www' },
        { name: 'Trump Survival Pack', value: 'trumpbag' },
        { name: 'Reject Pack', value: 'reject' },
        { name: 'Reject Pack 2', value: 'reject2' }
      ]
    }
  },
  computed: {
    endLobby () {
      return this.$store.state.endLobby
    },
    users () {
      const users = this.$store.state.users
      if (this.endLobby) {
        const sorted = [...users]
        sorted.sort((a, b) => b.points - a.points)
        console.log(sorted)

        users.forEach(user => {
          if (user.name === sorted[0].name) user.trophy = 'gold'
          if (user.name === sorted[1].name) user.trophy = 'silver'
          if (user.name === sorted[2].name) user.trophy = 'bronze'
        })
      }
      return users
    }
  },
  methods: {
    saveSettings () {
      const cardDecks = this.selected.map(deck => deck.value)
      this.$store.dispatch('change_settings', { points_to_win: parseInt(this.pointsToWin), card_decks: cardDecks, hand_size: parseInt(this.handSize) })
    },
    onClick () {
      this.$store.dispatch('start_game')
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped lang="scss">
.lobby {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .title {
    font-size: 90px;
  }

  .users {
    display: flex;
    max-width: 90%;
    flex-wrap: wrap;
    margin: 50px 0;

    .user {
      display: flex;
      align-items: center;
      flex-direction: column;

      .tropy {
        margin-top: 15px;
        font-size: 50px;
      }

      .gold { color: var(--gold); }
      .silver { color: var(--silver); }
      .bronze { color: var(--bronze); }
    }
  }

  .settings {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    .multiselect {
      margin: 5px 0;
      min-width: 200px;
    }
  }

  .actions {
    .button {
      margin: 0 5px;
    }
  }

}
</style>
