<template>
  <div>
    <h1>Register receiving address</h1>
    <p v-if="$fetchState.pending">
      Loading...
    </p>
    <p v-else-if="$fetchState.error" class="error">
      An error occurs...
    </p>
    <template v-else-if="valid">
      <p>Register <code>{{ walletAddress }}</code> as your receiving address</p>
      <button v-if="walletAddress && !isDone" class="button" @click="register">
        Register
      </button>
      <p v-if="isDone">
        Registered
      </p>
      <p v-else-if="isSending">
        Registering...
      </p>
    </template>
    <p v-else class="error">
      Link invalid. Please use <code>/set_wallet</code> to generate a new one
    </p>
    <p v-if="errorMsg" class="error">
      {{ errorMsg }}
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ENDPOINT } from '@/config'

export default {
  name: 'Register',
  data: () => ({
    valid: false,
    isSending: false,
    isDone: false,
    errorMsg: '',
    ENDPOINT,
  }),
  async fetch () {
    const { token } = this.$route.query
    this.token = token
    try {
      const { data: { valid } } = await this.$axios.get('/api/token', {
        params: { token, address: this.walletAddress },
      })
      this.valid = valid
    } catch (err) {
      this.errorMsg = err
    }
  },
  computed: {
    ...mapState('wallet', {
      walletAddress: state => state.walletAddress,
    }),
  },
  methods: {
    async register () {
      try {
        this.isSending = true
        await this.$axios.post('/api/register', {
          token: this.token,
          address: this.walletAddress,
        })
        this.isDone = true
      } catch (err) {
        this.errorMsg = err
      } finally {
        this.isSending = false
      }
    },
  },
}
</script>
