<template>
  <div class="hands" ref="hand" v-if="render">
    <Card v-for="(card, index) in hands" :key="index" ref="card" :id="index" :selectable="!placed && !disabled" :style="{'--slotted-time': `${plotAnimation}ms`}">
      {{card}}
      <template v-slot:container>
        <transition name="scaleSelect">
          <Button v-if="placeable && index == inSlot[blackCard.pick].id" class="accept abs" icon="done" rounded @click="onSelect"></Button>
        </transition>
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'Hands',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    allPlaced: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dragging: undefined,
      startPos: {
        top: 0,
        left: 0
      },
      nearSlot: null,
      inSlot: {},
      slotted: undefined,
      placed: false,
      plotAnimation: 300,
      slotPositions: undefined,
      render: true
    }
  },
  watch: {
    allPlaced (to, from) {
      if (to && !from) {
        console.log(this.inSlot)

        Object.values(this.inSlot).forEach(s => document.body.removeChild(s))
      } else if (!to && from) {
        this.placed = false
        this.inSlot = {}
      }
    },
    hands (newVal, oldVal) {
      this.render = false
      setTimeout(() => {
        this.render = true
      }, 10)
    }
  },
  computed: {
    hands () {
      return this.$store.state.hands
    },
    blackCard () {
      return this.$store.state.blackCard
    },
    placeable () {
      return Object.values(this.inSlot).length === this.blackCard.pick && !this.placed
    }
  },
  mounted () {
    // document.addEventListener('touchmove', this.drag)
    // document.addEventListener('touchstart', this.dragstart)
    // document.addEventListener('touchend', this.dragend)
    document.addEventListener('mousemove', this.drag)
    document.addEventListener('mousedown', this.dragstart)
    document.addEventListener('mouseup', this.dragend)
  },
  methods: {
    calcSlotPositions () {
      const rects = document.getElementsByClassName('user-card-fields')
      const fields = {}

      rects.forEach(rect => {
        const bounds = rect.getBoundingClientRect()
        fields[rect.id] = { top: bounds.top, left: bounds.left }
      })
      this.slotPositions = fields
    },
    distance (x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2))
    },
    drag ($event) {
      if (!this.dragging) return

      let top = $event.clientY - this.startPos.top
      let left = $event.clientX - this.startPos.left

      Object.entries(this.slotPositions).forEach(entrie => {
        const id = entrie[0]
        const bounds = entrie[1]

        const dist = this.distance(left, top, bounds.left, bounds.top)

        if (!this.nearSlot || this.nearSlot === id) {
          if (this.inSlot[id] && ((dist <= 50 && this.nearSlot !== id) || (dist > 50 && this.nearSlot === id))) {
            this.inSlot[id].style.transform = this.nearSlot ? '' : 'translate(20px, -20px)'
          }
          this.nearSlot = dist <= 50 ? id : null

          if (this.nearSlot === id) {
            top = bounds.top
            left = bounds.left
          } else {
            if (!this.dragging.classList.contains('moving')) {
              var audio = new Audio('/sounds/swip.mp3')
              audio.play()
            }

            this.dragging.classList.add('moving')
            if (this.inSlot[id] === this.dragging) {
              this.$delete(this.inSlot, id)
            }
          }
        }
      })

      this.dragging.style.top = top + 'px'
      this.dragging.style.left = left + 'px'
    },
    dragstart ($event) {
      if (this.placed || this.disabled) return
      const el = Object.values(this.$refs.card).map(el => el.$el).find(el => el === $event.target || el.contains($event.target))

      if (!el || el.classList.contains('slotted') || el.classList.contains('placed')) return
      this.dragging = el
      const pos = this.dragging.getBoundingClientRect()

      if (!Object.values(this.inSlot).includes(this.dragging)) { document.body.appendChild(this.dragging) }
      this.dragging.classList.add('global')

      this.dragging.style.top = pos.top + 'px'
      this.dragging.style.left = pos.left + 'px'

      this.startPos = {
        top: $event.clientY - pos.top,
        left: $event.clientX - pos.left
      }
      Object.entries(this.inSlot).forEach(entrie => {
        if (entrie[1] === this.dragging) {
          this.nearSlot = entrie[0]
        }
      })

      this.calcSlotPositions()
    },
    dragend () {
      if (!this.dragging) return

      if (!this.nearSlot) {
        this.dragging.style.top = ''
        this.dragging.style.left = ''
        this.dragging.classList.remove('global')
        this.$refs.hand.appendChild(this.dragging)

        const audio = new Audio('/sounds/zpfw.mp3')
        audio.play()
      } else {
        const oldSlot = this.inSlot[this.nearSlot]
        if (oldSlot && oldSlot !== this.dragging) {
          oldSlot.style.top = ''
          oldSlot.style.left = ''
          oldSlot.style.transform = ''
          oldSlot.classList.remove('global')
          this.$refs.hand.appendChild(oldSlot)
        }

        this.$set(this.inSlot, this.nearSlot, this.dragging)

        if (this.dragging.classList.contains('moving')) {
          this.$root.$emit('slot' + this.nearSlot, true)
          this.dragging.classList.add('slotted')
          const d = this.dragging
          clearTimeout(this.slotted)
          this.slotted = setTimeout(() => {
            d.classList.remove('slotted')
          }, this.plotAnimation + 100)

          const audio = new Audio('/sounds/pflp.mp3')
          audio.play()
        }
      }

      this.dragging.classList.remove('moving')
      this.dragging = undefined
      this.nearSlot = null
    },
    onSelect () {
      this.placed = true
      const cards = Object.values(this.inSlot).map(slot => this.hands[parseInt(slot.id)])

      var audio = new Audio('/sounds/plopplop.mp3')
      audio.play()

      this.$store.dispatch('place_cards', cards)
    }
  }
}
</script>
<style scoped lang="scss">
.hands {
  position: absolute;
  bottom: -200px;
  padding: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  .card {
    margin: 0px 10px;
  }
}
</style>
<style lang="scss">
body .card {
  --slotted-time: 300ms;

  &.slotted .card-element {
    animation: slotted var(--slotted-time);
  }

  .moving {
    z-index: 20;
  }

  .accept {
    --card-top: 100%;
    --card-left: 100%;
    --button-color: var(--grey);
    --button-font-color: var(--green);

    &.scaleSelect-enter, &.scaleSelect-leave-to {
      transform: translate(-50%, -50%) scale(0.1);
    }
    &.scaleSelect-enter-to, &.scaleSelect-leave {
      transform: translate(-50%, -50%) scale(1);
    }
    &.scaleSelect-enter-active {
      transition: 150ms ease-out;
    }
    &.scaleSelect-leave-active {
      transition: 150ms ease-in;
    }

    &:active {
      transform: translate(-50%, -50%) scale(0.90);
    }
  }

  @keyframes slotted {
    0% {transform: scale(1.05);}
    50% {transform: scale(0.95);}
  }
}
</style>
