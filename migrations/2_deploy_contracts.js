const Raffle = artifacts.require("Adoption");

module.exports = function (deployer) {
  const ticketPrice = web3.utils.toWei("0.01", "ether");
  const jackpotPercent = 90;
  deployer.deploy(Raffle);
};
