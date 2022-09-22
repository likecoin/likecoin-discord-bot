import 'dotenv/config';

export {
  NODE_ENV,
  LIKECOIN_CHAIN_ENDPOINT,
  CHAIN_EXPLORER,
  API_WALLET_ADDRESS,
  WIDGET_ENDPOINT,
  WALLET_CONFIG,
  UI_URL,
  BACKEND_PORT,
  BACKEND_HOST,
  SESSION_EXPIRATION,
} from '@likecoin-discord-bot/config';

export const {
  TOKEN,
  CLIENT_ID,
  MNEMONIC,
  DB_NAME,
  DB_USER,
  DB_PASS,
} = process.env;

export const PREFIX_PAIRS = [
  ['cosmos', 'like'],
  ['cosmosvaloper', 'likevaloper'],
  ['cosmosvalcons', 'likevalcons'],
];
