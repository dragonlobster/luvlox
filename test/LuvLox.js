const chai = require("chai");
const chaiAsPromised = require('chai-as-promised') // chai tests async/await
const expect = chai.expect;
chai.use(chaiAsPromised)
require('dotenv').config();

describe("Token contract", function () {

  let owner // deployer address;
  let addr1 // eth address 1;
  let addr2 // eth address 2;
  let contract // contract;
  const mintOptions = {value: ethers.utils.parseEther("0.1")} // mint options; set value to 0.1 eth (cost of nft)

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners(); // equivalent to web3.eth.getAccounts - set owner to first

    const factory = await ethers.getContractFactory(process.env.CONTRACT_NAME); // abstraction that follows factory pattern to deploy contracts
    contract = await factory.deploy("LuvLox", "LUX"); // deploy the contract - deploys with first wallet from hardhat node

    await contract.flipSaleState() // activate sale

    await contract.setBaseURI("ipfs://test/")

  })

  it("mints 1 nft to addr1", async () => {

    // get balance after minting, make sure it's 1
    await contract.connect(addr1).mintLock(mintOptions)
    const nft_balance = await contract.balanceOf(addr1.address)
    expect(nft_balance).equal(1) 

    // check owner of first nft
    const nft_owner = await contract.ownerOf(1)
    expect(nft_owner).equal(addr1.address)

  });

  it("checks tokenURI for nft", async () => {

    await contract.connect(addr1).mintLock(mintOptions)
    const tokenURI = await contract.tokenURI(1)

    expect(tokenURI).equal("ipfs://test/1")

  })

  it ("returns error on query for nonexistent token", async () => {

    await expect(contract.tokenURI(1)).rejectedWith("VM Exception")

  })


});