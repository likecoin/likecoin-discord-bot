import express from 'express';
import { initDB } from './backend/src/db.js';
import { TOKEN, BACKEND_PORT, BACKEND_HOST } from './backend/src/config.js';
import client from './backend/src/client.js';
import router from './backend/src/router.js';

initDB();
const app = express();
app.use('/discord', router);
app.use('/discord', express.static('frontend/dist'));
app.listen(BACKEND_PORT, BACKEND_HOST);
console.log(`Server listening on port ${BACKEND_HOST}:${BACKEND_PORT}`);
client.login(TOKEN);
