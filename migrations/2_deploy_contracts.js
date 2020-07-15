const GargToken = artifacts.require("./GargToken.sol");

module.exports = function (deployer) {
	deployer.deploy(GargToken);
};
