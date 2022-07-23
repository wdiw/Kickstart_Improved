import web3 from "./web3";
const compiledFactory =
  require("../ethereum/build/CampaignFactory.json").CampaignFactory;

const stringAbi = JSON.stringify(compiledFactory.abi);
const instance = new web3.eth.Contract(
  JSON.parse(stringAbi),
  "0xE49b7C80aA9aB17dd7e14cA114a9CdEfD855DB40"
);

export default instance;
