//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ElectionVote {
    uint public numberOfCandidate = 0;

    struct Candidator {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidator) public candidators;

    function setCandidator(string memory _name) public {
        candidators[numberOfCandidate] = Candidator(numberOfCandidate, _name, 0); 
        numberOfCandidate ++;
    }

    //1. get list of candidator
    function getCandidator() view public returns(Candidator[] memory) {
        Candidator[] memory _candidators = new Candidator[](numberOfCandidate);
        for(uint i = 0; i < numberOfCandidate; i ++) {
            Candidator storage _candidator = candidators[i];
            _candidators[i] = _candidator;
        }
        return _candidators;
    }

    //2. vote for candidator
    function voteCandidator(uint _id) public {
        for(uint i = 0; i < numberOfCandidate; i ++){
            if(candidators[i].id == _id){
                candidators[i].voteCount ++;
                break;
            }
        }
    }

    //3. get highest vote candidator
    function getHighestVote() public view returns (Candidator memory) {
        Candidator memory _candidator = candidators[0];
        for(uint i = 0; i < numberOfCandidate; i ++) {
            if(_candidator.voteCount < candidators[i].voteCount){
                _candidator = candidators[i];
            }
        }
        return _candidator;
    }
}