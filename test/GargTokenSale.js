const { default: Web3 } = require("web3");
const { assert } = require("chai");

const GargToken = artifacts.require("./GargToken.sol");
const GargTokenSale = artifacts.require("./GargTokenSale.sol");
contract("GargTokenSale", async (accounts) => {
	let token, tokenSale;
	const tokenPrice = 1000000000000000; //in wei
	const admin = accounts[0];
	const buyer = accounts[1];
	const tokensAvailable = 750000;
	var numberOfTokens = 10;

	before(async () => {
		token = await GargToken.new(1000000);
		tokenSale = await GargTokenSale.new(token.address, tokenPrice);
		await token.transfer(tokenSale.address, tokensAvailable);
	});
	describe("Initialize contract with correct values", () => {
		it("Check initializations", async () => {
			const address = tokenSale.address;
			assert.notEqual(address, 0x0, "Has contract address");
			const tokenContractAddress = tokenSale.tokenContract();
			assert.notEqual(tokenContractAddress, 0x0, "Has a token contact address, address");
			const price = await tokenSale.tokenPrice();
			assert.equal(price.toString(), tokenPrice.toString(), "Token price in wei");
		});
	});

	describe("Token buying", () => {
		it("Facilitates token buying", async () => {
			const receipt = await tokenSale.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice });
			const tokensSold = await tokenSale.tokensSold();
			assert.equal(tokensSold.toNumber(), numberOfTokens, "No of tokens sold");
			assert.equal(receipt.logs.length, 1, "Triggers one event");
			assert.equal(receipt.logs[0].event, "Sell", "Triggers Sell event");
			assert.equal(receipt.logs[0].args._buyer, buyer, "Logs the address which purchased the tokens");
			assert.equal(receipt.logs[0].args._amount, numberOfTokens, "Logs the number of tokens purchased");
		});
		it("Check updated balance of buyer and contract", async () => {
			const contractTokenBalance = await token.balanceOf(tokenSale.address);
			const buyerTokenBalance = await token.balanceOf(buyer);
			assert.equal(contractTokenBalance.toNumber(), tokensAvailable - numberOfTokens);
			assert.equal(buyerTokenBalance.toNumber(), numberOfTokens);
		});
		it("Try to buy tokens different from ether value", async () => {
			try {
				await tokenSale.buyTokens(numberOfTokens + 10, { from: buyer, value: numberOfTokens * tokenPrice });
				assert.fail("Assert should fail as tokens does not equal value");
			} catch (e) {
				assert(e.message.indexOf("revert") !== -1, "Revert must be present");
			}
		});
		it("Try to buy tokens more what contract has", async () => {
			try {
				await tokenSale.buyTokens(1000001, { from: buyer, value: numberOfTokens * tokenPrice });
				assert.fail("Assert should fail as contact does not have this much tokens");
			} catch (e) {
				assert(e.message.indexOf("revert") !== -1, "Revert must be present");
			}
		});
	});

	describe("End token sale function", () => {
		var adminBalanceBefore;
		var adminBalanceAfter;
		it("Only be called by admin", async () => {
			try {
				await tokenSale.endSale({ from: accounts[1] });
				assert.fail();
			} catch (e) {
				assert(e.message.indexOf("revert") !== -1, "Error message must contain revert");
			}
		});

		it("Transfer tokens back to admin", async () => {
			await tokenSale.endSale({ from: admin });
			const adminTokenBalance = await token.balanceOf(admin);
			const contractTokenBalance = await token.balanceOf(tokenSale.address);
			assert.equal(adminTokenBalance.toNumber(), 1000000 - 10, "Contract balance should go to admin");
			assert.equal(contractTokenBalance.toNumber(), 0, "Contract balance should go to admin");
		});

		it("Self Destruct", async () => {
			assert.equal(tokenPrice.address, undefined, "TokenPrice address is undefined");
		});
	});
});
