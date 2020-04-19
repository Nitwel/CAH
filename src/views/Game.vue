<template>
  <div class="game">
    <div class="title">{{title}}</div>
    <div class="points">
      <span v-for="user in points" :key="user.name">{{zar == user.name? '(czar)': ''}} {{user.name}} has {{user.points}} points.</span>
    </div>
    <div class="table">
      <div class="slots">
        <div class="user-slot" v-for="(user, pos) in users" :key="user.name">
          <Card
            v-for="(p, i) in blackCard.pick"
            :key="pos + '-' + i"
            :event-id="pos"
            :indeterminate="!user.placed"
            :small="blackCard.pick > 1"
            :xSmall="blackCard.pick > 2"
            :class="{placed: user.placed, clickable: isZar && allPlaced && !allRevealed}"
            @click.native="selected(pos)"
          >
            <User v-if="!allPlaced" :name="user.name" :small="!user.placed" :x-small="user.placed" class="abs"/>
            <User v-if="winnerSelected" :name="posToUser[pos]" x-small class="abs"/>
            <span class="questionmark abs" v-if="user.placed && !isRevealed(pos)">?</span>
            <span class="revealed" v-if="isRevealed(pos)" v-html="revealed[pos][i]"></span>
            <transition name="scaleSelect">
              <Button v-if="isZar && allRevealed && i == blackCard.pick - 1 && !winnerSelected" class="winner abs" icon="done" rounded @click="onSelectWinner(pos)"></Button>
            </transition>
          </Card>
        </div>
        <div class="user-slot" v-if="!isZar && !allPlaced">
          <Effect v-for="p in blackCard.pick" :key="p" :trigger="'slot'+p" :time="500" effect="pop">
            <Card class="user-card-fields" :id="p" indeterminate :small="blackCard.pick > 1" :xSmall="blackCard.pick > 2">
              <img class="add" src="../assets/add-full.svg" alt="add">
            </Card>
          </Effect>
        </div>
      </div>
      <Card class="black" black>
        <span v-html="blackCard.text"></span>
      </Card>
    </div>
    <Hands :disabled="isZar" :allPlaced="allPlaced"/>
  </div>
</template>

<script>
export default {
  name: 'Game',
  props: {
    name: String
  },
  data () {
    return {
      rotating: -1
    }
  },
  computed: {
    isZar () {
      return this.$store.state.zar === this.$store.state.name
    },
    allPlaced () {
      return this.$store.getters.allPlaced
    },
    allRevealed () {
      return this.$store.getters.allRevealed
    },
    winnerSelected () {
      return this.$store.state.tempToUser && Object.values(this.$store.state.tempToUser).length > 0
    },
    users () {
      if (this.allPlaced && !this.isZar) {
        return this.$store.state.users.filter(u => u.name !== this.$store.state.zar)
      } else {
        return this.$store.state.users.filter(u => u.name !== this.$store.state.name && u.name !== this.$store.state.zar)
      }
    },
    points () {
      return this.$store.state.users
    },
    blackCard () {
      return this.$store.state.blackCard
    },
    revealed () {
      return this.$store.state.revealed
    },
    posToUser () {
      const posToTemp = this.$store.state.tempIds
      const tempToUser = this.$store.state.tempToUser
      const posToUser = {}
      Object.entries(posToTemp).forEach(entrie => {
        posToUser[entrie[0]] = tempToUser[entrie[1]]
      })
      return posToUser
    },
    zar () {
      return this.$store.state.zar
    },
    title () {
      if (this.winnerSelected) {
        return `${this.$store.state.winner} won. Next round starts in ${this.$store.state.timer}s.`
      }

      if (this.isZar) {
        if (this.allPlaced && !this.allRevealed) {
          return 'Its your turn to reveal the cards!'
        } else if (this.allRevealed) {
          return 'Now select your favorite!'
        } else {
          return 'Wait until all players have placed their cards!'
        }
      } else {
        if (this.allPlaced && !this.allRevealed) {
          return `${this.zar} is revealing the cards!`
        } else if (this.allRevealed) {
          return `${this.zar} is selecting is favorite!`
        } else {
          return `Place your cards! ${this.zar} is the czar.`
        }
      }
    }
  },
  methods: {
    isRevealed (pos) {
      return this.revealed[pos] && this.revealed[pos].length > 0
    },
    selected (pos) {
      if (!this.isZar || !this.allPlaced || this.revealed[pos]) return

      this.rotating = pos
      this.$store.dispatch('reveal_cards', pos)
    },
    onSelectWinner (pos) {
      var audio = new Audio('/sounds/plopplop.mp3')
      audio.play()

      this.$store.dispatch('winner', pos)
    }
  }
}
</script>
<style scoped lang="scss">
.game {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;

  @media (max-width: 1000px) {
    padding-bottom: 50px;
  }

  @media (max-width: 800px) {
    padding-bottom: 20px;
  }

  .title {
    position: absolute;
    top: 30px;
    font-size: 40px;

    @media (max-width: 1000px) {
      font-size: 30px;
    }
    @media (max-width: 800px) {
      font-size: 20px;
    }
  }

  .points {
    position: absolute;
    top: 40px;
    left: 10px;
    display: flex;
    flex-direction: column;
    @media (max-width: 1000px) {
      top: 60px;
    }
  }

  .table {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;

    @media (max-width: 800px) {
      flex-direction: column-reverse;
    }

    .slots {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;

      .user-slot {
        perspective: 800px;

        .card {
          margin: 15px;
          transform-style: preserve-3d;

          @media (max-width: 800px) {
            margin: 5px;
          }

          &.placed {
            --card-top: 10px;
            --card-left: 20px;

            @media (max-width: 800px) {
              --card-top: 0px;
              --card-left: 0px;
            }
          }

          &.clickable {
            cursor: pointer;
          }

          .user {
            transition-property: top, left;
            transition: 300ms ease-in-out;
          }

          .questionmark {
            --card-top: 50%;
            --card-left: 50%;

            font-size: 100px;
          }

          .winner {
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
        }
      }

      .user-card-fields {

        .add {
          margin-top: 8px;
          width: 100px;

          @media (max-width: 1000px) {
            margin-top: 0px;
            width: 70px;
          }
        }
      }
    }

    .black {
      @media (min-width: 801px) {
        margin-left: 50px;
      }
    }
  }
}
</style>
