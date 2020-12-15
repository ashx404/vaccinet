const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("../fabric/vaccineJS/CAUtil");
const { buildCCPOrg1, buildWallet } = require("../fabric/vaccineJS/AppUtil.js");
const { Wallets } = require("fabric-network");

const channelName = "mychannel";
const chaincodeName = "basic";
const mspOrg1 = "Org1MSP";
const walletPath = path.join(__dirname, "wallet");

const org1UserId = "appUser";

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

// build an instance of the fabric ca services client based on
// the information in the network configuration

// setup the wallet to hold the credentials of the application user

// in a real application this would be done on an administrative flow, and only once

enrollSuperAdmin = async (ccp) => {
  const caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");
  const wallet = await buildWallet(Wallets, walletPath);
  await enrollAdmin(caClient, wallet, mspOrg1);
};
// in a real application this would be done only when a new user was required to be added
// and would be part of an administrative flow
registerAndEnrollGeneralUser = async (ccp, id) => {
  const caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");
  const wallet = await buildWallet(Wallets, walletPath);
  await registerAndEnrollUser(
    caClient,
    wallet,
    mspOrg1,
    id,
    "org1.department1"
  );
};

exports.enrollSuperAdmin = enrollSuperAdmin;
exports.registerAndEnrollGeneralUser = registerAndEnrollGeneralUser;
