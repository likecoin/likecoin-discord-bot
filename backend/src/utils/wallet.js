import { ISCNSigningClient } from '@likecoin/iscn-js';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import {
  ENDPOINT, MNEMONIC, API_WALLET_ADDRESS, WALLET_CONFIG,
} from '../config.js';

async function getSigningClient() {
  // Use mnemonic
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC);
  const [wallet] = await signer.getAccounts();
  if (API_WALLET_ADDRESS !== wallet) { throw new Error('API wallet address not match'); }

  const signingClient = new ISCNSigningClient();
  await signingClient.connectWithSigner(`${ENDPOINT}/rpc/`, signer);
  return signingClient;
}

export async function send(user, receiver, amountInLIKE) {
  const client = await getSigningClient();
  const res = await client.executeSendGrant(API_WALLET_ADDRESS, user.sendAddress, receiver, [{
    denom: WALLET_CONFIG.coinMinimalDenom,
    amounts: amountInLIKE * (10 ** WALLET_CONFIG.coinDecimals),
  }]);
  console.log(res);
  return res.transactionHash;
}
