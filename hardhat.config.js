require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.12",
  networks: {
    rinkeby: {
      url: process.env.INFURA_API_ENDPOINT,
      accounts: [`${process.env.METAMASK_PRIVATE_KEY}`]
    }
  }
};
