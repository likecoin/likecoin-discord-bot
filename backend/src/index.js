import express from 'express';
import helmet from 'helmet';
import { initDB } from './db.js';
import { TOKEN, BACKEND_PORT, BACKEND_HOST } from './config.js';
import client from './client.js';
import router from './router.js';

initDB();
const app = express();
app.use(helmet());
app.use(router);
app.listen(BACKEND_PORT, BACKEND_HOST);
client.login(TOKEN);
// eslint-disable-next-line no-console
console.log(`Server listening on port ${BACKEND_HOST}:${BACKEND_PORT}`);
