export const { NODE_ENV, IS_TESTNET } = process.env
export const IS_DEV = NODE_ENV !== 'production'
export const IPFS_GATEWAY = 'https://cloudflare-ipfs.com'
export const ARWEAVE_GATEWAY = 'https://arweave.net'
export const API_WALLET_ADDRESS = process.env.API_WALLET_ADDRESS || 'like1nvpr74cdkx270lcual3dvzr3t3jpy7qufph5a2'
export const SEND_GRANT_EXPIRATION = 30 // 30 days
export const SESSION_EXPIRATION = 15 // 15 minutes
export const UI_BASE_PATH = IS_DEV ? '/' : '/discord/';
const UI_BASE = process.env.UI_BASE || IS_DEV ? 'http://localhost:3000' : `https://api.${IS_TESTNET ? 'rinkeby.' : 'like.co'}`
export const UI_URL = `${UI_BASE}${UI_BASE_PATH}`.replace(/\/+$/, '');
export const BACKEND_HOST = process.env.BACKEND_HOST || '127.0.0.1';
export const BACKEND_PORT = process.env.BACKEND_PORT || 8000;
export const BACKEND_URL = process.env.BACKEND_URL || `http://${BACKEND_HOST}:${BACKEND_PORT}`
export const LIKECOIN_CHAIN_ENDPOINT = IS_TESTNET
  ? 'https://node.testnet.like.co'
  : 'https://mainnet-node.like.co'

export const WIDGET_ENDPOINT = IS_TESTNET
  ? 'https://testnet.like.co'
  : 'https://like.co'

export const CHAIN_EXPLORER = IS_TESTNET
  ? 'https://testnet.bigdipper.live/likecoin'
  : 'https://bigdipper.live/likecoin'

export const WALLET_CONFIG = IS_TESTNET
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
