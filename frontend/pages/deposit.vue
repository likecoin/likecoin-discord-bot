<template>
  <main>
    <h1>Deposit</h1>
    <label>Deposit Amount: <input v-model="amount" type="number">{{ demon }}</label>
    <p v-if="walletAddress !== address" class="error">
      Wallet address doesn't match deposit address: {{ address }}
    </p>
    <br>
    <button class="button" :disabled="walletAddress !== address" @click="createSendGrant">
      Sign
    </button>
    <p v-if="isSending">
      Sending...
    </p>
    <p v-if="error" class="error">
      {{ error }}
    </p>
    <p v-if="txHash">
      <a :href="`${ENDPOINT}/cosmos/tx/v1beta1/txs/${txHash}`">{{ txHash }}</a>
    </p>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import { WALLET_CONFIG, ENDPOINT } from '@likecoin-discord-bot/config'

export default {
  name: 'Deposit',
  data: () => ({
    hash: '',
    address: '',
    amount: 100,
    demon: WALLET_CONFIG.coinDenom,
    ENDPOINT,
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
