const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json").CampaignFactory;
const MNEMONIC =
  "list approve surge exhaust expose transfer list dragon multiply width carpet crash";
const provider = new HDWalletProvider(
  MNEMONIC,
  "https://rinkeby.infura.io/v3/cea2d39776094df9b2ec98c35edc640d"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const factoryAbi = JSON.stringify(compiledFactory.abi);
  console.log("Attempting to deploy from account", accounts[0]);
  console.log(factoryAbi);
  const result = await new web3.eth.Contract(JSON.parse(factoryAbi))
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({ gas: "3000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
