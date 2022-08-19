<template>
  <main>
    <h1>Deposit</h1>
    <p>{{ hash }}</p>
    <p>{{ walletAddress }}</p>
    <p>{{ address }} hi</p>
    <label>Deposit Amount: <input v-model="amount" type="number">{{ demon }}</label>
    <p v-if="isSending">
      Sending...
    </p>
    <p v-if="error" class="error">
      {{ error }}
    </p>
    <button class="button" @click="createSendGrant">
      Sign
    </button>
    <p v-if="txHash">
      <a :href="`${INDEXER}/txs/${txHash}`">{{ txHash }}</a>
    </p>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import { WALLET_CONFIG, INDEXER } from '../config'

export default {
  name: 'Deposit',
  data: () => ({
    hash: '',
    address: '',
    amount: 100,
    demon: WALLET_CONFIG.coinDenom,
    INDEXER,
  }),
  computed: {
    ...mapState('wallet', {
      walletAddress: state => state.walletAddress,
      isSending: state => state.isSending,
      error: state => state.error,
      txHash: state => state.txHash,
    }),
  },
  mounted () {
    const { hash, address } = this.$route.query
    this.hash = hash
    this.address = address
  },
  methods: {
    createSendGrant () {
      this.$store.dispatch('wallet/createSendGrant', { amount: this.amount, memo: this.hash })
    },
  },
}
</script>
