<template>
  <main>
    <h1>Deposit</h1>
    <p>{{ hash }}</p>
    <p>{{ walletAddress }}</p>
    <p>{{ address }}</p>
  </main>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'Deposit',
  data: () => ({
    hash: '',
    address: '',
  }),
  fetch () {
    const { hash, address } = this.$route.query
    this.hash = hash
    this.address = address
  },
  computed: {
    // walletAddress () {
    //   return this.$store.state.wallet.walletAddress
    // }
    ...mapState('wallet', {
      walletAddress: state => state.walletAddress,
    }),
  },
}
</script>
