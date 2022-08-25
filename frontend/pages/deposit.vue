<template>
  <main>
    <h1>Deposit</h1>
    <p v-if="$fetchState.pending">
      Loading...
    </p>
    <p v-else-if="$fetchState.error" class="error">
      An error occurs...
    </p>
    <div v-else-if="valid">
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
      <p v-if="errorMsg" class="error">
        {{ errorMsg }}
      </p>
      <div v-if="txHash">
        <p>Authorized success! Now use /balance to check your deposit and /send to send the LIKE to others!</p>
        <p>Tx: <a :href="`${ENDPOINT}/cosmos/tx/v1beta1/txs/${txHash}`">{{ txHash }}</a></p>
      </div>
    </div>
    <p v-else class="error">
      Link invalid. Please use /deposit to generate a new one
    </p>
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
    valid: false,
    errorMsg: '',
    ENDPOINT,
  }),
  async fetch () {
    const { hash, token } = this.$route.query
    this.hash = hash
    this.token = token
    const res = await this.$axios.get('/api/token', { params: { token: this.token } })
    this.valid = res.data.valid
  },
  computed: {
    ...mapState('wallet', {
      walletAddress: state => state.walletAddress,
      isSending: state => state.isSending,
      error: state => state.error,
      txHash: state => state.txHash,
    }),
  },
  methods: {
    async createSendGrant () {
      await this.$store.dispatch('wallet/createSendGrant', { amount: this.amount, memo: this.hash })
      try {
        await this.$axios.post('/api/deposit', {
          token: this.token,
          txHash: this.txHash,
        })
      } catch (err) {
        this.errorMsg = err
      }
    },
  },
}
</script>
