export const { NODE_ENV } = process.env
export const IPFS_GATEWAY = 'https://cloudflare-ipfs.com'
export const ARWEAVE_GATEWAY = 'https://arweave.net'
export const API_WALLET_ADDRESS = 'like1sdz7wpzdazxekr6f4sx33rtc7nra6lu9nxe7yh'
export const EXPIRATION = 30 // 30 days
export const ENDPOINT = NODE_ENV === 'development'
  ? 'https://node.testnet.like.co'
  : 'https://mainnet-node.like.co'

export const WIDGET_ENDPOINT = NODE_ENV === 'development'
  ? 'https://testnet.like.co'
  : 'https://like.co'

export const WALLET_CONFIG = NODE_ENV === 'development'
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
