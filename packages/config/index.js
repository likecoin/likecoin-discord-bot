export const { NODE_ENV } = process.env
export const IPFS_GATEWAY = 'https://cloudflare-ipfs.com'
export const ARWEAVE_GATEWAY = 'https://arweave.net'
export const API_WALLET_ADDRESS = process.env.API_WALLET_ADDRESS || 'like1sdz7wpzdazxekr6f4sx33rtc7nra6lu9nxe7yh'
export const SEND_GRANT_EXPIRATION = 30 // 30 days
export const UI_BASE_PATH = '';
const UI_BASE = process.env.UI_BASE || 'http://localhost:3000'
export const UI_URL = `${UI_BASE}${UI_BASE_PATH}`;
export const BACKEND_PORT = 8000;
export const BACKEND_URL = process.env.BACKEND_URL || `http://127.0.0.1:${BACKEND_PORT}`
export const isDev = NODE_ENV === 'development'
export const LIKECOIN_CHAIN_ENDPOINT = isDev
  ? 'https://node.testnet.like.co'
  : 'https://mainnet-node.like.co'

export const WIDGET_ENDPOINT = isDev
  ? 'https://testnet.like.co'
  : 'https://like.co'

export const WALLET_CONFIG = isDev
  ? {
      chainId: 'likecoin-public-testnet-5',
      chainName: 'LikeCoin',
      rpcURL: 'https://node.testnet.like.co/rpc/',
      restURL: 'https://node.testnet.like.co',
      coinType: 118,
      coinDenom: 'EKIL',
      coinMinimalDenom: 'nanoekil',
      coinDecimals: 9,
      bech32PrefixAccAddr: 'like',
      bech32PrefixAccPub: 'likepub',
      bech32PrefixValAddr: 'likevaloper',
      bech32PrefixValPub: 'likevaloperpub',
      bech32PrefixConsAddr: 'likevalcons',
      bech32PrefixConsPub: 'likevalconspub',
    }
  : {
      chainId: 'likecoin-mainnet-2',
      chainName: 'LikeCoin',
      rpcURL: 'https://mainnet-node.like.co/rpc/',
      restURL: 'https://mainnet-node.like.co',
      coinType: 118,
      coinDenom: 'LIKE',
      coinMinimalDenom: 'nanolike',
      coinDecimals: 9,
      bech32PrefixAccAddr: 'like',
      bech32PrefixAccPub: 'likepub',
      bech32PrefixValAddr: 'likevaloper',
      bech32PrefixValPub: 'likevaloperpub',
      bech32PrefixConsAddr: 'likevalcons',
      bech32PrefixConsPub: 'likevalconspub',
    }
