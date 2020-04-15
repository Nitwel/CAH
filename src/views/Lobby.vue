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
    <div class="actions">
      <Button v-if="$store.state.host == $store.state.name" @click="onClick">{{endLobby? "Next Round" : "Start"}}</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lobby',
  props: {
    name: {
      type: String
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
    onClick () {
      this.$store.dispatch('start_game')
    }
  }
}
</script>
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

}
</style>
