import express from 'express';

import { Session, User } from './db.js';
import { api, verifyUser } from './utils/index.js';

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
  console.log(req.body);
  const { txHash, token } = req.body;
  try {
    const session = await Session.findOne({ where: { token } });
    if (!session) { throw new Error('SESSION_NOT_FOUND'); }
    const { data } = await api.get(`/cosmos/tx/v1beta1/txs/${txHash}`);
    console.log(data);
    const { messages: [{ granter }] } = data.tx.body;
    const [user] = await User.findOrBuild({
      where: { discordId: session.discordId },
      defaults: {
        receiveAddress: granter,
      },
    });
    user.sendAddress = granter;
    console.log(user.toJSON());
    await verifyUser(user);
    await user.save();
    await session.destroy();
    res.json({ msg: 'success' });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).send(err.toString());
});

export default app;
