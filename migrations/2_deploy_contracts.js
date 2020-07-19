const GargToken = artifacts.require("./GargToken.sol");
const GargTokenSale = artifacts.require("./GargTokenSale.sol");

module.exports = async function (deployer) {
	await deployer.deploy(GargToken, 1000000);
	const gargToken = await GargToken.deployed();

	const tokenPrice = 1000000000000000; //0.01Ether
	await deployer.deploy(GargTokenSale, gargToken.address, tokenPrice);
	const gargTokenSale = await GargTokenSale.deployed();

	// Transfer 75 perc tokens to GargTokenSale
	await gargToken.transfer(gargTokenSale.address, "750000");
};
