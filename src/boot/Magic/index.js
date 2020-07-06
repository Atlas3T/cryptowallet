import { Magic, RPCError, RPCErrorCode } from 'magic-sdk';
import { ethers } from 'ethers';
import bip39 from 'bip39';

const m = new Magic('pk_test_2CBB20C533645D99'); // ✨

// eslint-disable-next-line no-console
m.preload().then(() => { return console.log('Magic <iframe> loaded.'); });

const magic = {
  async login(email) {
    // log in a user by their email
    try {
      await m.auth.loginWithMagicLink({ email });
    } catch {
    // Handle errors if required!
    }
  },

  async logout() {
    await m.user.logout();
  },

  async isLoggedIn() {
    try {
      return await m.user.isLoggedIn();
    } catch {
      return false;
      // Handle errors if required!
    }
  },

  async updateEmail() {
    try {
      await m.user.updateEmail({ email: 'hello@example.com' });
    } catch (err) {
      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.UpdateEmailFailed:
            // Handle errors accordingly :)
            break;
          // eslint-disable-next-line no-console
          default: console.error(err);
        }
      }
    }
  },

  async getUser() {
    // Assumes a user is already logged in
    try {
      return await m.user.getMetadata();
    } catch {
      // Handle errors if required!
      return false;
    }
  },

  async getProvider() {
    const provider = new ethers.providers.Web3Provider(m.rpcProvider);
    return provider.getSigner();
  },

  async getMnemonic() {
    const provider = await this.getProvider();
    const entropy = await provider.signMessage('cryptowallet');
    const entropyBuffer = Buffer.from(entropy);
    const maxBytes = 32;
    const mnemonic = bip39.entropyToMnemonic(entropyBuffer.slice(0, maxBytes));
    return mnemonic;
  },
};

export default ({ Vue }) => {
  Vue.prototype.$magic = magic;
};
