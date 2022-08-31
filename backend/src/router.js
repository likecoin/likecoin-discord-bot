import express from 'express';

import { Session } from './db.js';
import {
  formatCoin, registerAddress, depositUser,
} from './utils/index.js';
import { getUser } from './client.js';

const app = express();

app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());

app.get('/api/token', async (req, res) => {
  const { token } = req.query;
  const session = await Session.findOne({ where: { token } });
  res.json({ valid: !!session });
});

app.post('/api/deposit', async (req, res, next) => {
  const { txHash, token } = req.body;
  try {
    const { user, amount, created } = await depositUser(token, txHash);
    (await getUser(user.discordId)).send({
      content: `Deposit ${formatCoin(amount)} from ${user.sendAddress}. ${created
        ? '\nReceiving address is set to deposit address by default.\nUse /register to change.'
        : ''}`,
      ephemeral: false,
    })
      .catch(console.warn); // Ignore error if DM is disabled
    res.json({ msg: 'success' });
  } catch (err) {
    next(err);
  }
});

app.post('/api/register', async (req, res, next) => {
  const { token, address } = req.body;
  try {
    const session = await Session.findOne({ where: { token } });
    if (!session) { throw new Error('SESSION_NOT_FOUND'); }
    const user = await registerAddress(session.discordId, address);
    await session.destroy();
    res.json({ msg: 'success' });
    (await getUser(user.discordId)).send({
      content: `Register receiving address to ${user.receiveAddress}`,
      ephemeral: false,
    })
      .catch(console.warn); // Ignore error if DM is disabled
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).send(err.toString());
});

export default app;
