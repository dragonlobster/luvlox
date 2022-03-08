# Love Chain

A smart contract that allows couples or best friends to lock their love on the ethereum blockchain

# Developer Guide
You will need to create a `.env` file in the `ROOT` directory with the following:

`.env`:
```sh
CONTRACT_NAME="LoveChain"
METAMASK_PRIVATE_KEY="<>"
INFURA_API_ENDPOINT="<>"
```

### Metamask:
**Only need if you want to deploy on `Rinkeby` - not needed for local testing** (see `hardhat.config.js`)
* Export private key from metamask wallet and copy into .env file (wallet to deploy from)
* Ensure wallet has some funds (for testing use a `Rinkeby` testnet faucet)

### Infura:
**Only need if you want to deploy on `Rinkeby` - not needed for local testing** (see `hardhat.config.js`)
* Sign up for an infura account, create a project, and set it to Rinkeby Network
* Copy the https API endpoint they provide and put it in the .env file

### Node:
* Install Node.js

### Test/Deploy Contract:

Compile:
```sh
npm run compile
```

Test:
```sh
npm test
```

Deploy (Rinkeby Testnet) - don't do this for local development - costs ether from testnet `Rinkeby` network:
```sh
npm run deploy
```

# Contract Explanation

The contract implements `ERC-720` standard from `Open Zeppelin`

Two extra functions we implemented for the owner of the contract are:

* `withdraw` - send balance of contract to owner 
* `flipSaleState` - turn the sale on or off 

Further, we override OpenZeppelin's `_baseURI` as intended - this automatically prefixes `_baseURI` to the `tokenURI` of the NFT - for example, if `_baseURI` is `ipfs://test/`, then the first love lock NFT issued tokenURI will be: `ipfs://test/1` where it is expected to have the `JSON` metadata

# Tests

Tests are extremely important in order to avoid security exploit by bad actors. We are using `hardhat` suite which creates a local blockchain and tests the contract on that.

We are using `node` library `chai` for testing. Tests are written like this (in `test/LoveChain.js`):


In the `beforeEach` function, we already deployed the contract from the first account provided by hardhat - that means before every test we will deploy a fresh contract to the local `hardhat` blockchain:

```javascript
contract = await factory.deploy("Love Chain", "lc"); // deploy the contract - deploys with first wallet from hardhat node
```

The first argument is the public name of the contract that everyone will see, the second is the abbreviation (like symbol of nft token) (can be anything)

`test`:
```javascript
it("checks tokenURI for nft", async () => {

    await contract.connect(addr1).mintLock(mintOptions) // mintOptions = {value: ethers.utils.parseEther("0.1")}
    const tokenURI = await contract.tokenURI(1)

    expect(tokenURI).equal("ipfs://test/1")

  })
```

This test calls `mintLock` function from the contract with a value of `0.1 ether` (needs to be converted to `wei` which is why we use `parseEther` function); if less than `0.1 ether` is in the value, the minting will fail because of the line in our contract (`contracts/LoveChain.sol`):

```javascript
require(msg.value >= loveLockPrice, "Ether value sent was incorrect");
```

When we get the result, we expect to the `tokenURI` to be the `baseURI`+`tokenID`; if not it will fail. You will notice that the `tokenURI` method is not specified anywhere in the contract; this is because it was an imported function. How do we know this function exists? We can refer to `ERC-721` standard interface to see available NFT methods:

https://eips.ethereum.org/EIPS/eip-721

This test will pass; you can try by running `npm test` - this works because `package.json` specifies in the script object:

```javascript
  "scripts": {
    "test": "npx hardhat test",
    "compile": "npx hardhat compile",
    "deploy": "npx hardhat run scripts/deploy.js --network rinkeby"
  },
```

In reality `npm test` will run the command `npx hardhat test`. However, for the other commands (such as `compile` and `deploy`) you must add a run for some reason (no idea why): `npm run compile`, `npm run deploy`

You can add your own scripts here for convenience instead of trying to memorize the `hardhat` commands

# Progress

We will need to write more tests and refine the contract as needed.

We may need to change the name because `LoveChain` seems to be taken; let's see.