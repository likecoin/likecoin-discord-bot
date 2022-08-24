<template>
  <main>
    <h1>Deposit</h1>
    <p>Authorized LikeCoin Discord Bot to send LIKE from your wallet</p>
    <p>The money will keep in your wallet until you /send it</p>
    <label>Authorized amount: <input v-model="amount" type="number">{{ demon }}</label>
    <br>
    <button class="button" @click="createSendGrant">
      Sign
    </button>
    <p v-if="isSending">
      Sending...
    </p>
    <p v-if="error" class="error">
      {{ error }}
    </p>
    <div v-if="txHash">
      <p>Authorized success! Now use /balance to check your deposit and /send to send the LIKE to others!</p>
      <p>Tx: <a :href="`${ENDPOINT}/cosmos/tx/v1beta1/txs/${txHash}`">{{ txHash }}</a></p>
    </div>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import { WALLET_CONFIG, ENDPOINT } from '@/config'

export default {
  name: 'Deposit',
  data: () => ({
    hash: '',
    token: '',
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
    const { hash, token } = this.$route.query
    this.hash = hash
    this.token = token
  },
  methods: {
    async createSendGrant () {
      await this.$store.dispatch('wallet/createSendGrant', { amount: this.amount, memo: this.hash })
      try {
        const res = await this.$axios.post('/api/deposit', {
          token: this.token,
          txHash: this.txHash,
        })
        console.log(res)
      } catch (err) {
        this.error = err
      }
    },
  },
}
</script>
