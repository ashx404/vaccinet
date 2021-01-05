const app = require("express")();
var bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const PORT = 5000;

const {
  enrollSuperAdmin,
  registerAndEnrollGeneralUser,
} = require("./utils/registerUser");

const { buildCCPOrg1 } = require("./fabric/vaccineJS/AppUtil.js");
const { connectNetwork } = require("./utils/connectNetwork");

// build an in memory object with the network configuration (also known as a connection profile)
const ccp = buildCCPOrg1();

app.use(bodyParser.json());

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/enroll", async (req, res) => {
  await enrollSuperAdmin(ccp);
  res.send("Admin enrolled successfully");
});

app.get("/enrollUser/:id", async (req, res) => {
  await registerAndEnrollGeneralUser(ccp, req.params.id);
  res.send("User enrolled successfully");
});

app.get("/initLedger/:user", async (req, res) => {
  const contract = await connectNetwork(ccp, req.params.user);
  console.log(
    "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
  );
  await contract.submitTransaction("InitLedger");
  console.log("*** Result: committed");
  res.send("Ledger initialised");
});

app.post("/createAsset/:user", async (req, res) => {
  const id = uuidv4();
  let assetData = req.body;
  assetData.id = id;

  //Check for user auth:Auth()

  console.log(assetData);
  try {
    const contract = await connectNetwork(ccp, req.params.user);
    console.log(
      "\n--> Evaluate Transaction: CreateAsset, function returns an asset with a given assetID"
    );
    result = await contract.submitTransaction(
      "CreateAsset",
      id,
      JSON.stringify(assetData)
    );
    console.log(result.toString());
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return res.status(200).send(prettyJSONString(result.toString()));
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/updateAsset/:user/:id", async (req, res) => {
  let assetData = req.body;

  //Check for user auth:Auth()

  console.log(assetData);
  try {
    const contract = await connectNetwork(ccp, req.params.user);
    console.log(
      "\n--> Evaluate Transaction: UpdateAsset, function returns an asset with a given assetID"
    );
    result = await contract.submitTransaction(
      "UpdateAsset",
      req.params.id,
      JSON.stringify(assetData)
    );
    console.log(result.toString());
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return res.status(200).send(prettyJSONString(result.toString()));
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/delete/:user/:id", async (req, res) => {
  //Check for user auth:Auth()
  try {
    const contract = await connectNetwork(ccp, req.params.user);
    console.log(
      "\n--> Evaluate Transaction: Delete function returns an asset with a given assetID"
    );
    result = await contract.submitTransaction("DeleteAsset", req.params.id);
    console.log(result.toString());
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return res.status(200).send(prettyJSONString(result.toString()));
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/getAssetById/:id/:user", async (req, res) => {
  //Public endpoint : "/id/public user can be generated"
  try {
    const contract = await connectNetwork(ccp, req.params.user);
    console.log(
      "\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID"
    );
    result = await contract.evaluateTransaction("ReadAsset", req.params.id);
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return res.status(200).send(prettyJSONString(result.toString()));
  } catch (err) {
    res.status(200).send(err);
  }
});

app.get("/getHistory/:id/:user", async (req, res) => {
  //Public endpoint : "/id/public user can be generated"
  try {
    const contract = await connectNetwork(ccp, req.params.user);
    console.log(
      "\n--> Evaluate Transaction: GetHistory, function returns an asset with a given assetID"
    );
    result = await contract.evaluateTransaction("GetHistory", req.params.id);
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return res.status(200).send(prettyJSONString(result.toString()));
  } catch (err) {
    res.status(200).send(err);
  }
});

app.get("/getAll/:user", async (req, res) => {
  //Check for user auth:Auth()
  try {
    const contract = await connectNetwork(ccp, req.params.user);
    console.log(
      "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
    );
    let result = await contract.evaluateTransaction("GetAllAssets");
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return res.status(200).send(prettyJSONString(result.toString()));
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/facilityData/:user", async (req, res) => {
  //Check for user auth:Auth()
  try {
    const contract = await connectNetwork(ccp, req.params.user);
    let result = await contract.evaluateTransaction(
      "GetFacilityWise",
      req.params.user
    );
    return res.send(prettyJSONString(result.toString()));
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(PORT, () => {
  console.log("Listening to port " + PORT);
});
