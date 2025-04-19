const RaffleSystem = artifacts.require("Raffle");

module.exports = async function (deployer, network, accounts) {
  const ticketPrice = web3.utils.toWei("1", "ether");
  const maxTicketsPerTx = 10;
  const jackpotPercentage = 90;
  const raffleDuration = 86400;
  const maxTickets = 8;

  await deployer.deploy(
    RaffleSystem,
    ticketPrice,
    maxTicketsPerTx,
    jackpotPercentage,
    raffleDuration,
    maxTickets
  );
};
