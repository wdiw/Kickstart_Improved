import web3 from "./web3";
const compiledFactory =
  require("../ethereum/build/CampaignFactory.json").CampaignFactory;

const stringAbi = JSON.stringify(compiledFactory.abi);
const instance = new web3.eth.Contract(
  JSON.parse(stringAbi),
  "0x904f2eB184F4eAd4178e95CC1f3B377218122E40"
);

export default instance;
