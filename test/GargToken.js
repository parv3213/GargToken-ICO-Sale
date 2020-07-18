// const { default: Web3 } = require("web3");
const { assert } = require("chai");
const GargToken = artifacts.require("./GargToken.sol");

contract("GargToken", (accounts) => {
  let token;
  beforeEach(async () => {
    token = await GargToken.new(1000000);
  });
  describe("Token Deployment", () => {
    it("Check the total supply upon deployment", async () => {
      const totalSupply = await token.totalSupply();
      assert.equal(totalSupply.toString(), "1000000");
    });
    it("Allocates the initial supply to admin", async () => {
      const deployerBalance = await token.balanceOf(accounts[0]);
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
    it("More than owner's balance", async () => {
      try {
        await token.transfer(accounts[1], 10000000);
        assert.fail("Error should have occured!");
      } catch (e) {
        assert(e.message.indexOf("revert") !== -1, "error message must contain revert");
      }
    });
    it("Successfull token transfer", async () => {
      let receipt = await token.transfer.call(accounts[1], 100, { from: accounts[0] });
      assert.equal(receipt, true, "event call should return true");
      receipt = await token.transfer(accounts[1], 1000, { from: accounts[0] });
      assert.equal(receipt.logs.length, 1, "tiggers only one event");
      assert.equal(receipt.logs[0].event, "Transfer", "Should be 'Transfer' event");
      assert.equal(receipt.logs[0].args._from, accounts[0], "Should be sender ");
      assert.equal(receipt.logs[0].args._to, accounts[1], "Should be receiver");
      assert.equal(receipt.logs[0].args._value.toString(), "1000", "Value transfered");
      const customerBalance = await token.balanceOf(accounts[1]);
      assert.equal(customerBalance.toString(), "1000", "customer balance not equal to transfered amount");
      const deployerBalance = await token.balanceOf(accounts[0]);
      assert.equal(deployerBalance.toString(), String(1000000 - 1000), "customer balance not reduced");
    });
  });

  describe("approve function", () => {
    it("approve tokens for delegated transfer", async () => {
      const approveCall = await token.approve.call(accounts[1], 100);
      let allowanceAmount = await token.allowance(accounts[0], accounts[1]);
      assert.equal(allowanceAmount.toString(), "0", "Customer tokens allowance by owner must be 0");
      assert.equal(approveCall, true, "The call should return true");
      const approve = await token.approve(accounts[1], 100);
      allowanceAmount = await token.allowance(accounts[0], accounts[1]);
      assert.equal(allowanceAmount.toString(), "100", "Customer tokens allowance by owner must be 100");
      assert.equal(approve.logs.length, 1, "tiggers only one event");
      assert.equal(approve.logs[0].event, "Approval", "Should be 'Approve' event");
      assert.equal(approve.logs[0].args._owner, accounts[0], "Should be owner's account");
      assert.equal(approve.logs[0].args._spender, accounts[1], "Should be spender");
      assert.equal(approve.logs[0].args._value.toString(), "100", "Value approved");
    });
  });
  describe("TransferFrom function", () => {
    it("Handle delegate token transfer", async () => {
      const fromAccount = accounts[2];
      const toAccount = accounts[3];
      const spendingAccount = accounts[4];
      // transfer some tokens to the fromAccount
      await token.transfer(fromAccount, 100, { from: accounts[0] });
      // fromAccount approve spendingAccount for 10 tokens
      await token.approve(spendingAccount, 10, { from: fromAccount });
      try {
        await token.transferFrom(fromAccount, toAccount, 1000, { from: spendingAccount });
        assert.fail("This transaction is not possible, an error should have occured");
      } catch (e) {
        assert(e.message.indexOf("revert") !== -1, "error message must contain revert");
      }
      try {
        await token.transferFrom(fromAccount, toAccount, 50, { from: spendingAccount });
        assert.fail("Spender allowance limit exceeded");
      } catch (e) {
        assert(e.message.indexOf("revert") !== -1, "error message must contain revert");
      }
      const transferFromCall = await token.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
      assert.equal(transferFromCall, true);
      const receipt = await token.transferFrom(fromAccount, toAccount, 5, { from: spendingAccount });
      const fromAccountBalance = await token.balanceOf(fromAccount);
      const toAccountBalance = await token.balanceOf(toAccount);
      assert.equal(fromAccountBalance.toString(), "95", "fromAccount balance must have gone down by 5 tokens");
      assert.equal(toAccountBalance.toString(), "5", "toAccount balance must be 5 tokens");
      assert.equal(receipt.logs.length, 1, "Tiggers only one event");
      assert.equal(receipt.logs[0].event, "Transfer", "Should be 'Transfer' event");
      assert.equal(receipt.logs[0].args._from, fromAccount, "Should be owner's account");
      assert.equal(receipt.logs[0].args._to, toAccount, "Should be spender");
      assert.equal(receipt.logs[0].args._value.toString(), "5", "Value approved");
      const allowanceAmount = await token.allowance(fromAccount, spendingAccount);
      assert.equal(allowanceAmount.toString(), "5", "Remaining allowance is 5");
    });
  });
});