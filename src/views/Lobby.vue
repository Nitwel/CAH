<template>
    <div class="lobby">
        <div class="title">Lobby</div>
        <div class="users">
            <User v-for="user in users" :key="user.name" :name="user.name" :invite="user.invite"></User>
        </div>
        <div class="actions">
            <Button>Start</Button>
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
  data () {
    return {
      users: [
        {
          name: 'Helena',
          invite: false
        },
        {
          name: 'Dirk',
          invite: false
        },
        {
          name: 'Renne',
          invite: false
        },
        {
          name: 'You',
          invite: false
        },
        {
          name: 'Invite',
          invite: true
        }
      ]
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
        justify-content: flex-start;
        align-items: center;
        max-width: 90%;
        flex-wrap: wrap;
        margin: 50px 0;
    }

}
</style>
