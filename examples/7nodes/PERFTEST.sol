
pragma solidity ^0.4.26;

contract PerfTest {
    bool public testBool;
    int public testInt;
    uint public testUint;
    address public testAddress;
    bytes32 public testBytes32;
    string public testString;

    event StateChange(uint indexed selector);
    
    enum EnumChoices { Choice1, Choice2, Choice3, Choice4 }
    EnumChoices public testEnum;
    uint constant numChoices = 4;
    
    uint[8] public testArray;
    mapping(uint => int) public testMapping;
    
    uint public counter;
    
    // Number of test variables, used for switching later
    uint constant numVars = 9;
    
    function stateChange() public {
        counter++;
        uint selector = counter % numVars;
        
        // No switch statement in Solidity so...
        if (selector == 0) {
            changeBool();
        }
        if (selector == 1) {
            changeInt();
        }
        if (selector == 2) {
            changeUint();
        }
        if (selector == 3) {
            changeAddress();
        }
        if (selector == 4) {
            changeBytes32();
        }
        if (selector == 5) {
            changeString();
        }
        if (selector == 6) {
            changeEnum();
        }
        if (selector == 7) {
            changeArray();
        }
        if (selector == 8) {
            changeMapping();
        }
        emit StateChange(selector);
    }
    
    function changeBool() public {
        testBool = !testBool;
    }
    
    function changeInt() public {
        // The idea is we increment and flip the sign
        // No native absolute value function in Solidity :(
        if (testInt < 0) {
            testInt = -(testInt-1);
        } else {
            testInt = -(testInt+1);
        }
    }
    
    function changeUint() public {
        testUint++;
    }
    
    function changeAddress() public {
        testAddress = address(int(testAddress)+1);
    }
    
    function changeBytes32() public {
        testBytes32 = keccak256(abi.encodePacked(testBytes32));
    }
    
    function changeString() public {
        testString = string(abi.encodePacked(keccak256(abi.encodePacked(testString))));
    }
    
    function changeEnum() public {
        testEnum = EnumChoices((uint(testEnum)+1) % numChoices);
    }
    
    function changeArray() public {
        uint index = block.number % 8;
        testArray[index] = block.number;
    }
    
    function changeMapping() public {
        testMapping[block.number]++;
    }
}
