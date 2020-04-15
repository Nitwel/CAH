<template>
  <button @click="$emit('click')" class="button" :class="{icon, rounded}">
      <span v-if="icon" class="icon material-icons">{{icon}}</span>
      <slot v-else/>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    icon: {
      type: String,
      default: null
    },
    rounded: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
.button {
    --button-color: var(--black);
    --button-font-color: var(--white);

    background-color: var(--button-color);
    color: var(--button-font-color);
    height: 54px;
    padding: 5px 30px;
    border: none;
    border-radius: 10px;
    font-size: 30px;
    font-weight: 500;
    cursor: pointer;

    &:focus, &:hover {
        background-color: var(--button-color);
    }

    &:focus * {
        outline: none;
    }

    &:active {
        transform: scale(0.95);
    }

    &.icon {
      display: flex;
      justify-content: center;
      align-items: center;

      padding: 5px;
      width: 54px;
      height: 54px;

      .icon {
        font-size: 46px;
      }
    }

    &.rounded {
      border-radius: 1000px;
    }
}
</style>
