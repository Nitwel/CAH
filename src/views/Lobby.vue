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
    <div class="settings">
      <div>
        <label>Card decks</label>
        <multiselect v-if="host" v-model="selected" :options="card_decks" taggable multiple label="name" track-by="value" :searchable="false">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.name }}</strong></template>
        </multiselect>
        <multiselect v-else :value="readonlyDecks" :options="card_decks" taggable multiple disabled>
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.name }}</strong></template>
        </multiselect>
      </div>
      <div>
        <label>Points to win</label>
        <input v-if="host" type="number" v-model="pointsToWin">
        <input v-else type="text" :value="$store.state.pointsToWin" disabled>
      </div>
      <div>
        <label>Hand size</label>
        <input v-if="host" type="number" v-model="handSize">
        <input v-else type="text" :value="$store.state.handSize" disabled>
      </div>
    </div>
    <div class="actions" v-if="host">
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
    readonlyDecks () {
      const decks = this.$store.state.cardDecks
      return this.card_decks.filter(d => decks.includes(d.value)).map(d => d.name)
    },
    host () {
      return this.$store.state.host === this.$store.state.name
    },
    endLobby () {
      return this.$store.state.endLobby
    },
    users () {
      const users = this.$store.state.users
      if (this.endLobby) {
        const sorted = [...users]
        const ranks = ['gold', 'silver', 'bronze']

        sorted.sort((a, b) => b.points - a.points)

        users.forEach(user => {
          for (let i = 0; i < 3 && i < sorted.length; i++) {
            if (user.name === sorted[i].name) user.trophy = ranks[i]
          }
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

    @media (max-width: 1000px) {
      font-size: 70px;
    }

    @media (max-width: 800px) {
      font-size: 50px;
    }
  }

  .users {
    display: flex;
    max-width: 90%;
    flex-wrap: wrap;
    margin: 50px 0;

    @media (max-width: 1000px) {
      margin: 10px 0;
    }

    .user {
      display: flex;
      align-items: center;
      flex-direction: column;

      @media (max-width: 1000px) {
        --user-width: 140px;
      }

      @media (max-width: 800px) {
        --user-width: 100px;
      }

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
    align-items: center;
    margin-bottom: 20px;
    font-size: 25px;

    > div {
      display: flex;
      flex-direction: column;
    }

    input {
      padding: 8px;
      color: var(--dark-grey);
      border: 4px solid var(--grey);
      border-radius: 10px;
      font-size: 20px;
      font-weight: 500;

      &:disabled {
        background: var(--white);
      }
    }

    @media (max-width: 1000px) {
      font-size: 20px;

      input {
        font-size: 15px;
      }
    }

    ::v-deep .multiselect {
      margin: 2px 0;
      min-width: 300px;

      .multiselect__select {
        height: 100%;
        transform-origin: 50% calc(50% + 1px);

      }

      &.multiselect--disabled {
        opacity: 1;

        .multiselect__select {
          display: none;
        }

        .multiselect__tags {
          padding-right: 0px;
        }
      }

      .multiselect__tags {
        color: var(--dark-grey);
        border: 4px solid var(--grey);
        border-radius: 10px;
        font-size: 20px;
        font-weight: 500;

        @media (max-width: 1000px) {
          font-size: 15px;
        }

        .multiselect__tags-wrap {

          .multiselect__tag {
            // margin: 0px 5px 0px 0px;
          }
        }
      }
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .button {
      margin: 5px 10px;
    }
  }

}
</style>
