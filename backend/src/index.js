import express from 'express';
import helmet from 'helmet';
import { initDB } from './db.js';
import {
  TOKEN,
  BACKEND_PORT,
  BACKEND_HOST,
  LIKECOIN_CHAIN_ENDPOINT,
} from './config.js';
import client from './client.js';
import router from './router.js';

initDB();
const app = express();
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'script-src': [
        "'self'",
        'sha256-tempUn1btibnrWwQxEk37lMGV1Nf8FO/GXxNhLEsPdg=',
        'sha256-7cJdwMd4UlYhTrkYbWHiWKgRMr1cbk0aAnatJSAIM1s=',
      ],
      'connect-src': [
        "'self'",
        'data:',
        LIKECOIN_CHAIN_ENDPOINT,
      ],
    },
  },
}));
app.use(router);
app.listen(BACKEND_PORT, BACKEND_HOST);
client.login(TOKEN);
// eslint-disable-next-line no-console
console.log(`Server listening on port ${BACKEND_HOST}:${BACKEND_PORT}`);
