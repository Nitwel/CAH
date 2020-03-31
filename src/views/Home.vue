<template>
  <div id="home">
      <div class="title">Cards against Humanity</div>
      <User name="Heinz" large/>
      <div class="start">
        <Input placeholder="Enter lobby name..." v-model="name"/>
        <Button @click="onClick">Join</Button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      name: ''
    }
  },
  props: {

  },
  methods: {
    onClick () {
      if (this.name) { this.$router.push(`/lobby/${this.name}`) }
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
    .button {
      margin-left: 20px;
    }
  }
}
</style>
