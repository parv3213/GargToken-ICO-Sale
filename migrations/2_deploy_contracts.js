const GargToken = artifacts.require("./GargToken.sol");
const GargTokenSale = artifacts.require("./GargTokenSale.sol");

module.exports = async function (deployer) {
	await deployer.deploy(GargToken, 1000000);
	// const token = await GargToken.deployed();
	const tokenPrice = 1000000000000000; //0.01Ether
	await deployer.deploy(GargTokenSale, GargToken.address, tokenPrice);
};
