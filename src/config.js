import 'dotenv/config';

export const {
  TOKEN,
  CLIENT_ID,
  NODE_ENV,
  GUILD_ID,
  CHANNEL_ID_FOR_TRANSLATE,
} = process.env;

export const WIDGET_ENDPOINT = NODE_ENV === 'production'
  ? 'https://like.co'
  : 'https://testnet.like.co';

export const PREFIX_PAIRS = [
  ['cosmos', 'like'],
  ['cosmosvaloper', 'likevaloper'],
  ['cosmosvalcons', 'likevalcons'],
];
