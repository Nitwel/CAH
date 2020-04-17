<template>
  <div id="home">
    <div class="title">Cards Against Humanity<div class="tag">BETA</div></div>
    <User :name="name" large hideName/>
    <div class="start">
      <Input placeholder="Your name..." v-model="name" maxlength="12"/>
      <Input v-if="showLobbyInput" placeholder="Enter lobby name..." v-model="lobby" maxlength="20"/>
      <div class="btns">
        <Button v-if="!showLobbyInput" @click="resetLobby">Change Lobby</Button>
        <Button @click="onClick" :disabled="!connected">Join</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      showLobbyInput: true
    }
  },
  created () {
    if (this.lobby !== '') this.showLobbyInput = false
  },
  props: {

  },
  computed: {
    name: {
      get () {
        return this.$store.state.name
      },
      set (val) {
        this.$store.state.name = val
      }
    },
    lobby: {
      get () {
        return this.$store.state.lobby
      },
      set (val) {
        this.$store.state.lobby = val
      }
    },
    connected () {
      return this.$store.state.connected
    }
  },
  methods: {
    onClick () {
      if (!this.connected) {
        this.$root.$emit('error', 'Not connected to the server.')
        return
      }

      if (!this.name) {
        this.$root.$emit('error', 'You must provide a user name.')
        return
      }

      if (!this.lobby) {
        this.$root.$emit('error', 'You must provide a lobby name.')
        return
      }
      this.$store.dispatch('join_lobby')
    },
    resetLobby () {
      this.showLobbyInput = true
    }
  }
}
</script>
<style scoped lang="scss">
#home {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    font-size: 90px;
    position: relative;
    .tag {
      position: absolute;
      font-size: 20px;
      top: 70%;
      right: -20px;
      background-color: var(--red);
      color: var(--white);
      padding: 2px 15px;
      border-radius: 5px;
    }
  }

  .user {
    margin: 50px 0;
  }

  .start {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .btns {
      display: flex;
      justify-content: space-between;
    }

    input {
      margin-bottom: 10px;
    }

    .button:not(:first-child) {
      margin-left: 20px;
    }
  }
}
</style>
