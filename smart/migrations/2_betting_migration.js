var Betting = artifacts.require("./Betting.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Betting, 1, web3.toHex('test'), 3, 0, accounts[0]);
};
