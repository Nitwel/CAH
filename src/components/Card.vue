<template>
  <div class="card">
    <div class="card-element" :class="{indeterminate, small, large, black, selectable}" ref="card">
      <slot />
      <svg v-if="indeterminate" class="border" viewBox="0 0 200 300">
        <rect x="5" y="5" width="190" height="290" rx="20" ry="20" stroke="var(--light-grey)" stroke-width="5" stroke-dasharray="20 20" fill="transparent"/>
      </svg>
    </div>
    <slot name="container"/>
  </div>
</template>

<script>
import Events from '../events'

export default {
  name: 'Card',
  props: {
    black: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: false
    },
    eventId: {
      type: Number,
      default: undefined
    }
  },
  created () {
    if (this.eventId !== undefined) {
      Events.$on('rotate_' + this.eventId, () => {
        const card = this.$refs.card
        if (!card) return

        card.classList.add('rotating')
        setTimeout(() => {
          card.classList.remove('rotating')
        }, 600)
      })
    }
  }
}
</script>
<style scoped lang="scss">
.card {
  position: relative;
  --card-top: 50%;
  --card-left: 50%;
  --rotation-time: 600ms;
  width: 200px;
  height: 300px;

  ::v-deep .abs {
    position: absolute;
    top: var(--card-top);
    left: var(--card-left);
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  &.global {
    position: absolute;
    z-index: 10;
  }

  .card-element {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    padding: 25px 20px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.35);
    z-index: 1;

    background-color: white;
    color: black;
    transition-property: transform;
    transition: 200ms ease-in-out;

    user-select: none;

    font-weight: 500;
    font-size: 20px;

    &.black {
      background-color: black;
      color: white;
    }

    &.selectable:hover {
      box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.23);
      transform: scale(1.05);
      cursor: pointer;
      z-index: 5;
    }

    &.indeterminate {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      box-shadow: none;
      padding: 0;

      .border {
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }

    &.rotating {
      transition-duration: 0s;
      animation: rotate 600ms ease-in-out;
      transform: rotateY(0deg) rotateX(0deg);

      @keyframes rotate {
        0% {
          transform: rotateY(180deg) rotateX(0deg);
          color: var(--white);
        }
        49% {
          color: var(--white);
        }
        50% {
          color: unset;
        }
        100% {
          transform: rotateY(0deg) rotateX(0deg);
        }
      }

      & > * {
        backface-visibility: hidden;
      }
    }
  }
}
</style>
