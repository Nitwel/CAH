<template>
  <input type="text" :placeholder="placeholder" class="input" @input="$emit('input', $event.target.value)" :value="value"/>
</template>

<script>
export default {
  name: 'Input',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Enter...'
    }
  }
}
</script>
<style lang="scss" scoped>
.input {
    color: var(--dark-grey);
    height: 54px;
    padding: 5px 30px;
    border: 4px solid var(--grey);
    border-radius: 10px;
    font-size: 30px;
    font-weight: 500;

    &:focus, &:hover {
    }

    &:focus * {
        outline: none;
    }
}
</style>
