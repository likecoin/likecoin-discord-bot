import express from 'express';

import { Session, User } from './db.js';
import {
  api, getBalance, verifyUser, formatCoin, registerAddress,
} from './utils/index.js';
import client from './client.js';

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
    const session = await Session.findOne({ where: { token } });
    if (!session) { throw new Error('SESSION_NOT_FOUND'); }
    const { data } = await api.get(`/cosmos/tx/v1beta1/txs/${txHash}`);
    console.log(data);
    const { messages: [{ granter }] } = data.tx.body;
    const [user, created] = await User.findOrBuild({
      where: { discordId: session.discordId },
      defaults: {
        receiveAddress: granter,
      },
    });
    user.sendAddress = granter;
    console.log(user.toJSON());
    await verifyUser(user);
    const { amount } = await getBalance(user);
    await user.save();
    await session.destroy();
    res.json({ msg: 'success' });
    client.users.cache.get(user.discordId).send({
      content: `Deposit ${formatCoin(amount)} from ${user.sendAddress}. ${created
        ? '\nReceiving address is set to deposit address by default.\nUse \\register to change.'
        : ''}`,
      ephemeral: false,
    })
      .catch(() => {}); // Ignore error if DM is disabled
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
    client.users.cache.get(user.discordId).send({
      content: `Register receiving address to ${user.receiveAddress}`,
      ephemeral: false,
    })
      .catch(() => {}); // Ignore error if DM is disabled
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).send(err.toString());
});

export default app;