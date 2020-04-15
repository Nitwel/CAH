<template>
  <div class="user" :class="{large, small, invite, xSmall}">
    <avataaar v-if="!invite" class="image" avatar-style="Circle" v-bind="look"></avataaar>
    <img v-else class="invite" src="../assets/add.svg" alt="add">
    <div v-if="name && !hideName" class="name">{{name}}</div>
  </div>
</template>

<script>
import Avataaar from 'vue-avataaar'
import AvataaarMetadata from 'vue-avataaar/src/AvataaarMetadata'

export default {
  name: 'User',
  components: {
    Avataaar
  },
  props: {
    name: {
      type: String,
      default: null,
      required: true
    },
    hideName: {
      type: Boolean,
      default: false
    },
    invite: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    xSmall: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    look () {
      const data = AvataaarMetadata
      delete data.avatarStyle

      const look = {}

      Object.entries(data).forEach((entrie, index) => {
        const option = entrie[0]
        const props = entrie[1].properties
        const hashSection = parseInt(this.hash.substring(index * 2, index * 2 + 2))

        look[option] = props[hashSection % props.length]
      })
      return look
    },
    hash () {
      const targetLength = 24
      let hash = ''
      let code = 9999
      for (let i = 0; i < targetLength; i++) {
        code = (this.name.charCodeAt(i % this.name.length) + code) % (this.name.length + 178)

        const codeStr = '00' + (code % 100)
        hash += codeStr.substring(codeStr.length - 2)
      }
      return hash
    }
  }
}
</script>
<style scoped lang="scss">
.user {
  --user-width: 180px;
  font-size: 35px;

  &.large {
    --user-width: 250px;
    font-size: 50px;
  }

  &.small {
    --user-width: 100px;
    .name {
      display: none;
    }
  }

  &.xSmall {
    --user-width: 60px;
    .name {
      display: none;
    }
  }

  &.invite {
    padding: 10px 5px 0px 5px;
    color: var(--dark-grey);
    cursor: pointer;

    &:active .invite{
      transform: scale(0.95);
    }

    .invite {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      width: var(--user-width);
      height: var(--user-width);
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        font-size: 70px;
      }
    }
  }

  display: flex;
  flex-direction: column;
  align-items: center;

  .image {
    width: var(--user-width);
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.25))
  }

  .name {
  }

}
</style>
