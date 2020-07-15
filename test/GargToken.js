const GargToken = artifacts.require("./GargToken.sol");

contract("GargToken", (accounts) => {
	it("Check the total supply upon deployment", async () => {
		const token = await GargToken.new();
		const totalSupply = await token.totalSupply();
		assert.equal(totalSupply.toString(), "1000000");
	});
});
