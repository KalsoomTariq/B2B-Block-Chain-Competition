// src/utils/web3.js
import Web3 from 'web3';

export const initWeb3 = async () => {
  // Modern dapp browsers
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return new Web3(window.ethereum);
    } catch (error) {
      console.error("User denied account access");
      throw error;
    }
  }
  // Legacy dapp browsers
  else if (window.web3) {
    return new Web3(window.web3.currentProvider);
  }
  // Fallback - local provider
  else {
    console.log("No web3 detected. Falling back to http://127.0.0.1:8545.");
    return new Web3('http://127.0.0.1:8545');
  }
};

export const getAccounts = async (web3) => {
  try {
    return await web3.eth.getAccounts();
  } catch (error) {
    console.error("Error getting accounts:", error);
    throw error;
  }
};