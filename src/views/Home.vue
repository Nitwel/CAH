<template>
  <div id="home">
    <div class="title">Cards against Humanity</div>
    <User :name="name" large hideName/>
    <div class="start">
      <Input placeholder="Your name..." v-model="name"/>
      <Input v-if="showLobbyInput" placeholder="Enter lobby name..." v-model="lobby"/>
      <Button @click="onClick">Join</Button>
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
    }
  },
  methods: {
    onClick () {
      if (this.name && this.lobby) {
        this.$store.dispatch('join_lobby')
      }
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
  }

  .user {
    margin: 50px 0;
  }

  .start {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    input {
      margin-bottom: 5px;
    }

    .button {
      margin-left: 20px;
    }
  }
}
</style>
