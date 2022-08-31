import { LikeCoinWalletConnector, LikeCoinWalletConnectorMethodType } from '@likecoin/wallet-connector'
import { ISCNSigningClient } from '@likecoin/iscn-js'
import { WALLET_CONFIG, API_WALLET_ADDRESS, LIKECOIN_CHAIN_ENDPOINT, SEND_GRANT_EXPIRATION } from '@likecoin-discord-bot/config'

let connector = null

export const state = () => ({
  offlineSigner: null,
  walletAddress: '',
  isSending: false,
  isShowAlert: false,
  txHash: '',
  error: '',
})

export const getters = {
  formattedWalletAddress (state) {
    return (
      state.walletAddress.split('1')[0] + '…' + state.walletAddress.slice(-4)
    )
  },

  txURL (state) {
    return connector
      ? `${LIKECOIN_CHAIN_ENDPOINT}/cosmos/tx/v1beta1/txs/${state.txHash}`
      : ''
  },
}

export const mutations = {
  setWallet (state, wallet) {
    const { accounts: [account], offlineSigner } = wallet
    state.offlineSigner = offlineSigner
    state.walletAddress = account.bech32Address || account.address
  },

  logout (state) {
    connector.disconnect()
    state.walletAddress = ''
  },

  prepareTx (state) {
    state.error = false
    state.txHash = ''
    state.isSending = true
  },

  doneTx (state, result) {
    state.isSending = false

    if (result.code === 0) {
      state.txHash = result.transactionHash
    } else {
      state.error = result.rawLog
    }
  },

  setError (state, error) {
    state.error = error
    state.isSending = false
  },
}

export const actions = {
  init ({ commit }) {
    connector = new LikeCoinWalletConnector({
      availableMethods: [
        LikeCoinWalletConnectorMethodType.Keplr,
        LikeCoinWalletConnectorMethodType.KeplrMobile,
        LikeCoinWalletConnectorMethodType.LikerId,
        LikeCoinWalletConnectorMethodType.Cosmostation,
      ],
      ...WALLET_CONFIG,
    })
    const session = connector.restoreSession()
    if (session?.accounts) {
      commit('setWallet', session)
    }
  },

  async connect ({ commit }) {
    const wallet = await connector.openConnectWalletModal()
    if (!wallet) { return }
    commit('setWallet', wallet)
  },

  async createSendGrant ({ state, commit, dispatch }, { amount, memo }) {
    if (!connector) { dispatch('init') }

    commit('setWallet', await connector.initIfNecessary())
    commit('prepareTx')
    const client = new ISCNSigningClient()
    await client.connectWithSigner(
      connector.rpcURL,
      state.offlineSigner,
    )

    const expire = new Date()
    expire.setDate(expire.getDate() + SEND_GRANT_EXPIRATION)

    try {
      const result = await client.createSendGrant(
        state.walletAddress,
        API_WALLET_ADDRESS,
        [{
          denom: WALLET_CONFIG.coinMinimalDenom,
          amount: `${amount * (10 ** WALLET_CONFIG.coinDecimals)}`,
        }],
        expire,
        { memo },
      )
      commit('doneTx', result)
    } catch (err) {
      commit('setError', err)
      console.error(err)
    }
  },
}
