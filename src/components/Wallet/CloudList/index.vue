<template>
  <div @touchmove="prevent">
    <div v-if="wallets.length === 0">
      <q-btn
        icon="add_circle_outline"
        label="add"
        color="primary"
        size="xl"
        class="large-cloud-btn"
        @click.prevent="openWalletsModal"
      />
    </div>
    <q-scroll-area
      v-if="wallets.length > 0"
      ref="scrollArea"
      class="scroll-area extended cloud-scroll"
    >
      <div class="scroll-offset" />

      <CloudListItem
        v-for="wallet in wallets"
        :key="wallet.displayName"
        :wallet="wallet"
        :currency="selectedCurrency"
      />
      <q-scroll-observable @scroll="scrolled" />
    </q-scroll-area>
  </div>
</template>

<script>
import CloudListItem from '@/components/Wallet/CloudListItem';
import { mapState } from 'vuex';
import Wallet from '@/store/wallet/entities/wallet';

export default {
  name: 'CloudList',
  components: {
    CloudListItem,
  },

  data() {
    return {
      scrollPosition: 0,
    };
  },

  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),

    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },

    wallets() {
      return Wallet.query()
        .where('account_id', this.authenticatedAccount)
        .where('imported', true).get();
    },
  },
  activated() {
    if (document.querySelectorAll('.cloud-scroll .scroll')[0]) {
      document.querySelectorAll('.cloud-scroll .scroll')[0].scrollTop = this.scrollPosition;
    }
  },

  methods: {
    openWalletsModal() {
      this.$root.$emit('walletsModalOpened', true);
    },

    prevent(event) {
      if (this.wallets.length === 0 || !this.$refs.scrollArea) { return false; }
      if (this.$refs.scrollArea.$el.childNodes[0].scrollTop > 0) {
        event.stopPropagation();
      }
      return false;
    },

    scrolled(data) {
      this.scrollPosition = data.position;
      if (data.position > 100 && data.direction === 'down') {
        this.$root.$emit('isHomeBalanceVisible', false);
      }
      if (data.position <= 100 && data.direction === 'up') {
        this.$root.$emit('isHomeBalanceVisible', true);
      }
    },
  },
};
</script>

<style>
.scroll-area {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.scroll-area .scroll {
  padding-bottom: 1rem;
}

.large-cloud-btn {
  width: 100%;
  height: 3em;
  border-radius: 0.4rem;
  font-size: 3em;
  padding: 0em;
  color: #1e3c57;
  margin-top: 5rem;

}

.large-cloud-btn i {
  color: #1e3c57;
}

.large-cloud-btn .q-btn-inner{
  color: #1e3c57;
}

.scroll-offset {
  height: 5rem;
}
</style>