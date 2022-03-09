// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract LuvLox is ERC721Enumerable, Ownable {

    uint256 public constant loveLockPrice = 0.01 ether; // price of each lock
    bool public saleIsActive; // activate the sale

    using Counters for Counters.Counter; // assign functions from Counters to struct Counter inside Counters
    Counters.Counter private _tokenIds; // tokenId which increments before each mint

    /* sets base URI in storage */
    string private baseURI;

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }
    /* end base URI */

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance); 
    }

    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    function mintLock() public payable {
        require(saleIsActive, "Sale is not active");
        require(msg.value >= loveLockPrice, "Ether value sent was incorrect");

        _tokenIds.increment();
        uint256 mintIndex = _tokenIds.current();

        _safeMint(msg.sender, mintIndex);

    }

}
