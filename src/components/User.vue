<template>
    <div class="user" :class="{large, small, invite}">
        <avataaar v-if="!invite" class="image" avatar-style="Circle" random></avataaar>
        <svg v-else class="invite" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="var(--grey)" stroke-width="3" stroke-dasharray="7 7" fill="transparent"/>
            <line x1="50" y1="35" x2="50" y2="65" stroke="var(--dark-grey)" stroke-width="4"/>
            <line x1="35" y1="50" x2="65" y2="50" stroke="var(--dark-grey)" stroke-width="4"/>
        </svg>
        <div >
        </div>
        <div v-if="name" class="name">{{name}}</div>
    </div>
</template>

<script>
import Avataaar from 'vue-avataaar'

export default {
  name: 'User',
  components: {
    Avataaar
  },
  props: {
    name: {
      type: String,
      required: true,
      default: null
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
        --user-width: 150px;
        font-size: 20px;
    }

    &.invite {
        padding: 15px 5px 0px 5px;

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
                color: var(--dark-grey);
                font-size: 70px;
            }

        }
    }

    display: flex;
    flex-direction: column;
    align-items: center;

    .image {
        width: var(--user-width);

    }

    .name {
    }

}
</style>
