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
      <p>The amount of LIKE granted will still stay in your wallet until you send it</p>
      <label>Authorized amount: <input v-model="amount" type="number">{{ denom }}</label>
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
        <p>Authorized success! Now use <code>/balance</code> to check your deposit and <code>/send</code> to send the LIKE to others!</p>
        <p>Tx: <a :href="txURL">{{ txHash }}</a></p>
      </div>
    </div>
    <p v-else class="error">
      Link invalid. Please use <code>/deposit</code> to generate a new one
    </p>
  </main>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { WALLET_CONFIG } from '@/config'

export default {
  name: 'Deposit',
  data: () => ({
    hash: '',
    token: '',
    amount: 100,
    denom: WALLET_CONFIG.coinDenom,
    valid: false,
    errorMsg: '',
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
    ...mapGetters('wallet', [
      'txURL',
    ]),
  },
  methods: {
    async createSendGrant () {
      try {
        await this.$store.dispatch('wallet/createSendGrant', { amount: this.amount, memo: this.hash })
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
