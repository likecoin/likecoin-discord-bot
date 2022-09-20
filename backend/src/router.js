import express from 'express';

import {
  formatCoin, registerAddress, depositUser, getSession,
} from './utils/index.js';
import { getUser } from './client.js';

const app = express();

app.use(express.json());

app.get('/api/healthz', async (req, res) => {
  res.sendStatus(200);
});

app.get('/api/token', async (req, res, next) => {
  try {
    const { token } = req.query;
    const session = await getSession(token);
    res.json({ valid: !!session });
  } catch (err) {
    next(err);
  }
});

app.post('/api/deposit', async (req, res, next) => {
  const { txHash, token } = req.body;
  try {
    const { user, amount, created } = await depositUser(token, txHash);
    (await getUser(user.discordId)).send(`Deposit ${formatCoin(amount)} from ${user.sendAddress}. ${created
      ? '\nReceiving address is set to deposit address by default.\nUse /set_wallet to change.'
      : ''}`)
      .catch(console.warn); // Ignore error if DM is disabled
    res.json({ msg: 'success' });
  } catch (err) {
    next(err);
  }
});

app.post('/api/register', async (req, res, next) => {
  const { token, address } = req.body;
  try {
    const session = await getSession(token);
    if (!session) { throw new Error('SESSION_NOT_FOUND'); }
    const user = await registerAddress(session.discordId, address);
    await session.destroy();
    res.json({ msg: 'success' });
    (await getUser(user.discordId)).send(`Register receiving address to ${user.receiveAddress}`)
      .catch(console.warn); // Ignore error if DM is disabled
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(JSON.stringify({
    message: err.toString(), stack: err.stack,
  }));
  if (res.headersSent) {
    next(err);
    return;
  }
  res.sendStatus(500);
});

export default app;
