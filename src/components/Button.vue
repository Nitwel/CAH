<template>
  <button @click="$emit('click')" class="button">
      <slot />
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    msg: String
  }
}
</script>
<style lang="scss" scoped>
.button {
    background-color: var(--black);
    color: var(--white);
    height: 54px;
    padding: 5px 30px;
    border: none;
    border-radius: 10px;
    font-size: 30px;
    font-weight: 500;
    cursor: pointer;

    &:focus, &:hover {
        background-color: var(--black);
    }

    &:focus * {
        outline: none;
    }

    &:active {
        transform: scale(0.95);
    }
}
</style>
