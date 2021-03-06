<template>
  <div>
    <div class="dots-wrapper">
      <span
        v-for="item in input"
        :key="item"
        class="dot"
      />
    </div>
    <keyboard
      :layouts="['123|456|789|0']"
      @input="inputPin"
    />

    <div class="btns-wrapper">
      <q-btn
        flat
        :disabled="resetDisabled"
        label="Clear"
        @click="clearPinArray"
      />

      <q-btn
        v-if="(mode === 'pin-setup'
          || mode === 'new-pin'
          || mode === 'pin-confirm'
          || mode === 'confirm-new-pin')"
        :disabled="canProceed"
        color="secondary"
        text-color="info"
        :label="$t('done')"
        @click="done"
      />

      <q-btn
        v-if="mode != 'pin-setup'
          && mode != 'new-pin'
          && mode !== 'pin-confirm'
          && mode != 'confirm-new-pin'
          && mode != 'delete'"
        :disabled="canProceed"
        color="secondary"
        text-color="info"
        :label="$t('unlock')"
        @click="confirmPin"
      />

      <q-btn
        v-if="mode === 'delete'"
        :disabled="canProceed"
        color="red"
        text-color="white"
        :label="$t('delete')"
        @click="confirmPin"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import keyboard from 'vue-keyboard';

export default {
  components: {
    keyboard,
  },
  props: {
    mode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      input: [],
    };
  },
  computed: {
    ...mapState({
      minLength: (state) => { return state.settings.pin.minLength; },
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
    canProceed() {
      return this.input.length < this.minLength;
    },
    resetDisabled() {
      return this.input.length === 0;
    },
  },
  mounted() {
    this.clearPinArray();
  },
  methods: {
    /**
     * Emits pincode to parent components.
      * @param {*} pin
     */
    inputPin(pin) {
      // if (navigator && navigator.vibrate) {
      //   const onInputVibrate = 25;
      //   navigator.vibrate(onInputVibrate);
      // }
      const isIos = /iPad|iPhone|iPod/.test(navigator.platform)
       || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      const vibrateTime = 25;
      if (navigator.vibrate && !isIos) {
        window.navigator.vibrate(vibrateTime);
      }
      this.input.push(Math.random());

      if (this.mode === 'pin-setup') {
        this.$store.dispatch('setup/setPin', { value: pin });
      }

      if (this.mode === 'pin-confirm') {
        this.$store.dispatch('setup/setPinConfirm', { value: pin });
      }
      if (this.mode === 'access'
          || this.mode === 'delete'
          || this.mode === 'new-pin'
          || this.mode === 'confirm-new-pin') {
        this.$emit('inputPin', pin);
      }
      if (this.mode === 'auth') {
        this.$root.$emit('inputPin', pin);
      }
    },
    confirmPin() {
      if (this.mode === 'pin-confirm') {
        this.$parent.validatePin();
      }
      if (this.mode === 'auth') {
        this.$parent.attemptUnlock();
      }
      if (this.mode === 'access') {
        this.$emit('attemptUnlock');
      }
      if (this.mode === 'delete') {
        this.$emit('attemptUnlock');
      }
    },
    clearPinArray() {
      this.input = [];
      if (this.mode === 'pin-setup') { this.$store.dispatch('setup/resetPin'); }
      if (this.mode === 'pin-confirm') { this.$store.dispatch('setup/resetPinConfirm'); }
      if (this.mode === 'auth') { this.$parent.resetPin(); }

      if (this.mode === 'access'
        || this.mode === 'delete'
        || this.mode === 'new-pin'
        || this.mode === 'confirm-new-pin') {
        this.$emit('resetPin');
      }
    },
    done() {
      if (this.mode === 'pin-setup') { this.$router.push({ path: `/setup/${this.id + 1}` }); }
      if (this.mode === 'new-pin') { this.$emit('newPinSet'); }
      if (this.mode === 'confirm-new-pin') { this.$emit('attemptConfirm'); }
      if (this.mode === 'pin-confirm') { this.confirmPin(); }
    },

    /**
     * Resets PinPad internal state
     */
    resetState() {
      this.input = [];
    },
  },
};

</script>

<style>
.vue-keyboard-key,
.vue-keyboard-key:hover {
  background: rgba(0,0,0,0);
  color: black;
  font-weight: bold;
  font-size: 1.5rem;
  width: 2.5em;
  height: 2.5em;
  margin: 0.25em 0.5em;
  line-height: 1.8;
  transition: all ease-in-out 100ms;
}

body.body--dark .vue-keyboard-key,
body.body--dark .vue-keyboard-key:hover {
  color: white;
}

.vue-keyboard-key.active {
  background: rgba(255,255,255,0.1);
}

.dots-wrapper {
  height: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: .5rem;
}

.dot {
  background: rgba(0,0,0,0.3);
  width: .75em;
  height: .75em;
  border-radius: 100%;
  display: block;
  margin: 0 .5em;
}

body.body--dark .dot {
    background: white;

}
</style>
