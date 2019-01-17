/*eslint-disable*/
async function discoverBitcoin(wallet, coinSDK, network) {
  const externalAccountDiscovery = await coinSDK.accountDiscovery(wallet.mnemonic, network);
  const internalAccountDiscovery = await coinSDK.accountDiscovery(wallet.mnemonic, network, true);

  let combinedUsedAddresses = [
    ...externalAccountDiscovery.active.map(item => item.address),
    ...internalAccountDiscovery.used.map(item => item.address),
  ];

  let combinedActiveAddresses = [
    ...externalAccountDiscovery.active.map(item => item.address),
    ...internalAccountDiscovery.active.map(item => item.address),
  ];

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  combinedUsedAddresses = combinedUsedAddresses.filter(onlyUnique);
  combinedActiveAddresses = combinedActiveAddresses.filter(onlyUnique);

  let utxos = [];
  if (combinedActiveAddresses.length > 0) {
    utxos = await coinSDK.getUTXOs(combinedActiveAddresses, network);
  }

  let balance = 0;
  utxos.forEach((utxo) => {
    balance += utxo.amount;
  });

  let txHistory = {
    address: [],
    txs: [],
  };

  const collectHistory = async function (from, to) {
    const history = await coinSDK.getTransactionHistory(combinedUsedAddresses, network, from, to);
    txHistory = {
      ...history,
      address: txHistory.address.concat(history.address),
      txs: txHistory.txs.concat(history.txs),
    };
    if (txHistory.more) await collectHistory(to + 1, to + 49);
  };

  if (combinedUsedAddresses.length > 0) await collectHistory(0, 50);
  const externalChainAddressIndex = externalAccountDiscovery.nextAddress;
  const internalChainAddressIndex = internalAccountDiscovery.nextAddress;

  return {
    txHistory,
    externalAccountDiscovery,
    internalAccountDiscovery,
    externalChainAddressIndex,
    internalChainAddressIndex,
    balance,
    utxos,
  };
}

async function discoverEthereum(wallet, coinSDK, network) {
  const accounts = await coinSDK.accountDiscovery(wallet.mnemonic, network);
  const txHistory = await coinSDK.getTransactionHistory([accounts[0].address], network, 0);
  const balance = await coinSDK.getBalance([accounts[0].address], network);

  return {
    accounts,
    txHistory,
    balance,
  };
}

async function discoverWallet(wallet, coinSDK, network, sdk) {
  if (sdk === 'Bitcoin') return await discoverBitcoin(wallet, coinSDK, network);
  if (sdk === 'Ethereum') return await discoverEthereum(wallet, coinSDK, network);
  return false;
}

export default ({ Vue }) => {
  Vue.prototype.discoverWallet = discoverWallet;
};