import 'dotenv/config';

export {
  NODE_ENV,
  ENDPOINT,
  API_WALLET_ADDRESS,
  WIDGET_ENDPOINT,
  WALLET_CONFIG,
  UI_URL,
  BACKEND_PORT,
} from '@likecoin-discord-bot/config';

export const {
  TOKEN,
  CLIENT_ID,
  MNEMONIC,
} = process.env;

export const PREFIX_PAIRS = [
  ['cosmos', 'like'],
  ['cosmosvaloper', 'likevaloper'],
  ['cosmosvalcons', 'likevalcons'],
];
