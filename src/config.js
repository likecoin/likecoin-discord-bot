import 'dotenv/config';

export const { TOKEN, CLIENT_ID, NODE_ENV } = process.env;

export const GUILD_ID = '475663520428720140';
export const TARGET_CHANNEL_ID = '475669759300468737';
export const COMMAND_NAME = 'translate';
export const COMMAND_OPTION_NAME = 'address';
export const WIDGET_ENDPOINT = NODE_ENV === 'production'
  ? 'https://like.co'
  : 'https://testnet.like.co';

export const PREFIX_PAIRS = [
  ['cosmos', 'like'],
  ['cosmosvaloper', 'likevaloper'],
  ['cosmosvalcons', 'likevalcons'],
];
