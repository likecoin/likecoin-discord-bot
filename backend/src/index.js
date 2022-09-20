import { initDB } from './db.js';
import { TOKEN, BACKEND_PORT } from './config.js';
import client from './client.js';
import router from './router.js';

initDB();
router.listen(BACKEND_PORT);
client.login(TOKEN);
// eslint-disable-next-line no-console
console.log(`Server listening on port ${BACKEND_PORT}`);
