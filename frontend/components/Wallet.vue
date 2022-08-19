<template>
  <div>
    <div v-if="walletAddress">
      <p>
        {{ walletAddress }}
      </p>
      <p>{{ chainId }}</p>
      <button class="button" @click="logout">
        Disconnect
      </button>
    </div>
    <button v-else class="button" @click="connectWallet">
      Connect
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { WALLET_CONFIG } from '@likecoin-discord-bot/config'

export default {
  name: 'Wallet',
  data () {
    return {
      chainId: WALLET_CONFIG.chainId,
    }
  },
  computed: {
    walletAddress () {
      return this.$store.state.wallet.walletAddress
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    connectWallet () {
      this.$store.dispatch('wallet/connect')
    },
    init () {
      this.$store.dispatch('wallet/init')
    },
    ...mapMutations({
      logout: 'wallet/logout',
    })
  },
}
</script>
