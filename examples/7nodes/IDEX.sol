/**
 * Inspired by mainnet IDEX contract
 * Modified for easier testing
 * Events/public properties should match original ABI
*/

pragma solidity ^0.4.26;

contract Exchange {
  mapping (address => uint256) public invalidOrder;
  mapping (address => mapping (address => uint256)) public tokens; //mapping of token addresses to mapping of account balances
  mapping (address => bool) public admins;
  mapping (address => uint256) public lastActiveTransaction;
  mapping (bytes32 => uint256) public orderFills;
  mapping (bytes32 => bool) public traded;
  mapping (bytes32 => bool) public withdrawn;

  address public feeAccount;
  address public owner;
  uint256 public inactivityReleasePeriod;

  event SetOwner(address indexed previousOwner, address indexed newOwner);
  event Order(address tokenBuy, uint256 amountBuy, address tokenSell, uint256 amountSell, uint256 expires,
    uint256 nonce, address user, uint8 v, bytes32 r, bytes32 s);
  event Cancel(address tokenBuy, uint256 amountBuy, address tokenSell, uint256 amountSell, uint256 expires,
    uint256 nonce, address user, uint8 v, bytes32 r, bytes32 s);
  event Trade(address tokenBuy, uint256 amountBuy, address tokenSell, uint256 amountSell, address get, address give);
  event Deposit(address token, address user, uint256 amount, uint256 balance);
  event Withdraw(address token, address user, uint256 amount, uint256 balance);

  uint256 counter = 0;
  uint256 numVars = 9;

  function TestCall() public {
    counter++;
    uint selector = counter % numVars;

    // Same logic as perftest here
    if (selector == 0) {
      feeAccount = address(int(feeAccount)+1);
    }
    if (selector == 1) {
      owner = address(int(owner)+1);
    }
    if (selector == 2) {
      inactivityReleasePeriod++;
    }
    if (selector == 3) {
      emit SetOwner(feeAccount, feeAccount);
    }
    if (selector == 4) {
      emit Order(feeAccount, inactivityReleasePeriod, feeAccount, inactivityReleasePeriod, inactivityReleasePeriod,
        inactivityReleasePeriod, feeAccount, uint8(inactivityReleasePeriod % 256), bytes32(inactivityReleasePeriod), bytes32(inactivityReleasePeriod));
    }
    if (selector == 5) {
      emit Cancel(feeAccount, inactivityReleasePeriod, feeAccount, inactivityReleasePeriod, inactivityReleasePeriod,
        inactivityReleasePeriod, feeAccount, uint8(inactivityReleasePeriod % 256), bytes32(inactivityReleasePeriod), bytes32(inactivityReleasePeriod));
    }
    if (selector == 6) {
      emit Trade(feeAccount, inactivityReleasePeriod, feeAccount, inactivityReleasePeriod, feeAccount, feeAccount);
    }
    if (selector == 7) {
      emit Deposit(feeAccount, feeAccount, inactivityReleasePeriod, inactivityReleasePeriod);
    }
    if (selector == 8) {
      emit Withdraw(feeAccount, feeAccount, inactivityReleasePeriod, inactivityReleasePeriod);
    }
  }
}
