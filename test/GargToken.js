// const { default: Web3 } = require("web3");
// const { assert } = require("chai");

// require("chai").use(require("chai-as-promised")).should();
const GargToken = artifacts.require("./GargToken.sol");

contract("GargToken", ([deployer, customer]) => {
	let token;
	before(async () => {
		token = await GargToken.new(1000000);
	});
	describe("Token Deployment", () => {
		it("Check the total supply upon deployment", async () => {
			const totalSupply = await token.totalSupply();
			assert.equal(totalSupply.toString(), "1000000");
		});
		it("Allocates the initial supply to admin", async () => {
			const deployerBalance = await token.balanceOf(deployer);
			assert.equal(deployerBalance.toString(), "1000000");
		});
		it("Check the name", async () => {
			const name = await token.name();
			assert.equal(name, "Garg Token");
		});
		it("Check the token symbol", async () => {
			const symbol = await token.symbol();
			assert.equal(symbol, "GARG");
		});
		it("Check the standard", async () => {
			const standard = await token.standard();
			assert.equal(standard, "Garg Token v1.0");
		});
	});
	describe("Tranfer function", () => {
		it("More than deployer's balance", async () => {
			try {
				await token.transfer(customer, 10000000);
				assert.fail("Error should have occured!");
			} catch (e) {
				assert(e.message.indexOf("revert") !== -1, "error message must contain revert");
			}
		});
		it("Successfull token transfer", async () => {
			let receipt = await token.transfer.call(customer, 100, { from: deployer });
			assert.equal(receipt, true, "event call should return true");
			receipt = await token.transfer(customer, 100, { from: deployer });
			assert.equal(receipt.logs.length, 1, "tiggers only one event");
			assert.equal(receipt.logs[0].event, "Transfer", "Should be 'Transfer' event");
			assert.equal(receipt.logs[0].args._from, deployer, "value of sender ");
			assert.equal(receipt.logs[0].args._to, customer, "value of receiver");
			assert.equal(receipt.logs[0].args._value, 100, "value transfered");
			const customerBalance = await token.balanceOf(customer);
			assert.equal(customerBalance.toString(), "100", "customer balance not equal to transfered amount");
			const deployerBalance = await token.balanceOf(deployer);
			assert.equal(deployerBalance.toString(), String(1000000 - 100), "customer balance not reduced");
		});
	});
});
