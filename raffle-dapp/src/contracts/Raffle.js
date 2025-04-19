// src/contracts/Raffle.js
import Web3 from 'web3';
import TruffleContract from '@truffle/contract';

// Import the ABI
const RaffleArtifact = require('./Raffle.json');
const Raffle = TruffleContract(RaffleArtifact);

export const initContract = async (provider) => {
  // Set the provider for our contract
  Raffle.setProvider(provider);
  return Raffle;
};

export const getRaffleInstance = async (contract, currentAccount) => {
  try {
    // Get deployed contract instance
    const instance = await contract.deployed();
    return instance;
  } catch (error) {
    console.error("Could not get contract instance:", error);
    throw error;
  }
};