import express from 'express';
import helmet from 'helmet';
import { initDB } from './backend/src/db.js';
import {
  TOKEN,
  UI_BASE_PATH,
  BACKEND_PORT,
  BACKEND_HOST,
  LIKECOIN_CHAIN_ENDPOINT,
} from './backend/src/config.js';
import client from './backend/src/client.js';
import router from './backend/src/router.js';

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

app.use(UI_BASE_PATH, router);
app.use(UI_BASE_PATH, express.static('frontend/dist'));
app.listen(BACKEND_PORT, BACKEND_HOST);
console.log(`Server listening on port ${BACKEND_HOST}:${BACKEND_PORT}`);
client.login(TOKEN);
