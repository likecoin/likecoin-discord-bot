import 'dotenv/config';

export {
  ENDPOINT, API_WALLET_ADDRESS, WIDGET_ENDPOINT, NODE_ENV,
  WALLET_CONFIG,
} from '@likecoin-discord-bot/config';

export const {
  TOKEN,
  CLIENT_ID,
} = process.env;

export const PREFIX_PAIRS = [
  ['cosmos', 'like'],
  ['cosmosvaloper', 'likevaloper'],
  ['cosmosvalcons', 'likevalcons'],
];
