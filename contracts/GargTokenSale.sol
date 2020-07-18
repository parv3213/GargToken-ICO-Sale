pragma solidity ^0.5.0;

import "./GargToken.sol";

contract GargTokenSale {
    address admin;
    GargToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(GargToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(
            msg.value == _numberOfTokens * tokenPrice,
            "Number of tokens does not match with the value"
        );
        require(
            tokenContract.balanceOf(address(this)) >= _numberOfTokens,
            "Contact does not have enough tokens"
        );
        require(
            tokenContract.transfer(msg.sender, _numberOfTokens),
            "Some problem with token transfer"
        );
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }
}
