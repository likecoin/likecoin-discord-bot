import { ISCNSigningClient } from '@likecoin/iscn-js';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import {
  LIKECOIN_CHAIN_ENDPOINT, MNEMONIC, API_WALLET_ADDRESS, WALLET_CONFIG,
} from '../config.js';

async function getSigningClient() {
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
    prefix: 'like',
  });
  const [{ address }] = await signer.getAccounts();
  if (API_WALLET_ADDRESS !== address) {
    throw new Error(`API wallet address not match: expect ${API_WALLET_ADDRESS} got ${address}`);
  }

  const signingClient = new ISCNSigningClient();
  await signingClient.connectWithSigner(`${LIKECOIN_CHAIN_ENDPOINT}/rpc/`, signer);
  return signingClient;
}

export async function send(user, receiverAddr, amount) {
  const client = await getSigningClient();
  const res = await client.executeSendGrant(
    API_WALLET_ADDRESS,
    user.sendAddress,
    receiverAddr,
    [{
      denom: WALLET_CONFIG.coinMinimalDenom,
      amount,
    }],
  );
  return res.transactionHash;
}
