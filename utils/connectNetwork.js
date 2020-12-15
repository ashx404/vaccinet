// Setting for Hyperledger Fabric
const path = require("path");
const { Wallets, Gateway } = require("fabric-network");
const CHANNEL = "mychannel";
const CONTRACT = "basic";
const { buildWallet } = require("../fabric/vaccineJS/AppUtil");
connectNetwork = async (ccpPath, identity) => {
  const walletPath = path.join(__dirname, "wallet");
  const wallet = await buildWallet(Wallets, walletPath);

  console.log(`Wallet path: ${walletPath}`);

  // Check to see if we've already enrolled the user.
  //   const userExists = await wallet.exists(identity);
  //   if (!userExists) {
  //     console.log(
  //       `An identity for the user ${identity} does not exist in the wallet`
  //     );
  //     console.log("Run the registerUser.js application before retrying");
  //     return;
  //   }

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccpPath, {
    wallet,
    identity: identity,
    discovery: {
      enabled: true,
      asLocalhost: true,
    },
  });
  // Get the network (channel) our contract is deployed to.
  const network = await gateway.getNetwork(CHANNEL);
  // Get the contract from the network.
  const contract = network.getContract(CONTRACT);
  return contract;
};

exports.connectNetwork = connectNetwork;
