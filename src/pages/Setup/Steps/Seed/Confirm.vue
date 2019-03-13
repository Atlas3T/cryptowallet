<template>
  <div>
    <h1 class="setup">
      {{ $t('confirmSeed') }}
    </h1>
    <p class="setup">
      {{ $t('pressSeed') }}
    </p>
    <div class="randomSeedContainer">
      <div class="seed-input-preview-box">
        <span
          v-for="(word, i) in seedPhrase"
          :key="`holder${i}`"
        >
          {{ word }}
        </span>
      </div>
    </div>
    <div class="randomSeedContainer">
      <q-btn
        v-for="(word, i) in shuffledSeed"
        :key="`word${i}`"
        :label="`${word}`"
        :disabled="wasUsed(word)"
        color="yellow"
        text-color="blueish"
        class="seed-btn"
        size="sm"
        @click="addToSequence(word)"
      />
    </div>
    <div class="btns-wrapper">
      <q-btn
        :disabled="resetDisabled"
        color="secondary"
        label="Reset"
        @click="reset"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { setTimeout } from 'timers';

export default {
  data() {
    return {
      pipSeq: [],
      seedPhrase: [],
    };
  },
  computed: {
    shuffledSeed() {
      return this.$store.getters['setup/getShuffledSeed'];
    },
    ...mapState({
      seed: (state) => { return state.setup.seed; },
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
    resetDisabled() {
      return this.pipSeq.length === 0;
    },
  },
  watch: {
    pipSeq() {
      if (this.pipSeq.length === 12) {
        setTimeout(() => {
          this.validate();
        }, 500);
      }
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    validate() {
      if (Object.keys(this.seed).join('') === this.pipSeq.join('')) {
        this.$router.push({ path: `/setup/${this.id + 1}` });
      } else {
        this.$toast.create(10, this.$t('seedSeqNotMatch'), 500);
        this.reset();
      }
    },
    addToSequence(pip) {
      this.pipSeq.push(pip);
      this.seedPhrase.push(pip);
    },
    reset() {
      this.pipSeq = [];
      this.seedPhrase = [];
    },
    wasUsed(pip) {
      return this.pipSeq.indexOf(pip) >= 0;
    },
  },
};

</script>

<style>
.randomSeedContainer {
  margin-top: 1em;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
}

.randomSeedContainer button {
  width: 31%!important;
  margin-bottom: 0.5rem;
}
.randomSeedContainer .q-input {
  width: 31%!important;
  margin: 0;
  margin-bottom: 0.5rem;
}

.seed-input .q-input-target{
    font-size: 0.65rem;
    color: white;
    text-align: center;
    text-transform: uppercase;
}

.randomSeedContainer .text-secondary {
    color: rgba(0, 0, 0, 0)!important;
}

.randomSeedContainer
.q-if:not(.q-if-disabled):not(.q-if-error):not(.q-if-warning):hover:before,
.q-if.q-if-readonly:not(.q-if-error):not(.q-if-warning):after {
    color: #bdbdbd!important;
    border-bottom: 1px solid;
}

.randomSeedContainer .q-if-focused{
  border: none;
}

.randomSeedContainer .q-if-standard {
  padding-bottom: 0px!important;
}

.seed-confirm-input {
  padding: 0;
}

.seed-input .q-if-inner {
  padding: 0rem;
  margin: 0!important;
}

.seed-btn .q-btn-inner {
  font-size: 0.8rem;
  padding: 0.3rem 0;
  text-transform: none;
}

.seed-input-preview-box {
  padding: 0.5rem;
  background: #22405a;
  font-size: 0.8rem;
  width: 100%;
  border-radius: 0.3rem;
  text-align: center;
  height: 5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-family: 'Montserrat-Semibold';
}

.seed-input-preview-box span {
  margin: 0.3rem;
  margin-bottom: 0;
}
</style>