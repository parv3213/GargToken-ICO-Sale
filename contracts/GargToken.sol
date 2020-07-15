pragma solidity ^0.5.0;

contract GargToken {
    string public name = "Garg Token"; //Optional
    string public symbol = "GARG"; //Optional
    string public standard = "Garg Token v1.0"; //Not in documentation, extra!
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) public {
        // allocate the initial supply
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    //Transfer function, Required!
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Not enough balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to,_value);
        return true;
    }
}
