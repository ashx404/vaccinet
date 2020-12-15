"use strict";

const { Contract } = require("fabric-contract-api");
const { QueryAll } = require("../utils/QueryAll");
const Asset = require("./asset");
class AssetTransfer extends Contract {
  async InitLedger(ctx) {
    const assets = [
      {
        ID: "asset1",
        State: "STORED",
        Location: "XYZ Pharma supplies,New Delhi",
        Owner: "Supplier",
        Quantity: 300,
      },
      {
        ID: "asset2",
        State: "STORED",
        Location: "Pharma supplier 2,Haryana",
        Owner: "Supplier",
        Quantity: 400,
      },
      {
        ID: "asset3",
        State: "STORED",
        Location: "Cold Storage 4,Gurgaon",
        Owner: "Manufacturer",
        Quantity: 500,
      },
      {
        ID: "asset4",
        State: "MOVING",
        Location: "Delivery Facility 1,Gurgaon",
        Owner: "Shipper",
        Quantity: 600,
      },
      {
        ID: "asset5",
        State: "MOVING",
        Location: "Delivery Facility 2,New Delhi",
        Owner: "Shipper",
        Quantity: 700,
      },
      {
        ID: "asset6",
        State: "STORED",
        Location: "ABC Pharma,New Delhi",
        Owner: "Manufacturer",
        Quantity: 800,
      },
    ];

    for (const asset of assets) {
      asset.docType = "asset";
      console.log(typeof asset, asset);
      await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
      console.info(`Asset ${asset.ID} initialized`);
    }
  }

  // CreateAsset issues a new asset to the world state with given details.
  async CreateAsset(ctx, id, assetData) {
    // await ctx.stub.putState(id, Buffer.from(assetData));
    return ctx.stub.putState(id, Buffer.from(assetData));
  }

  async ReadAsset(ctx, id) {
    const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  // UpdateAsset updates an existing asset in the world state with provided parameters.
  async UpdateAsset(ctx, id, newData) {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }
    // overwriting original asset with new asset
    return ctx.stub.putState(id, Buffer.from(newData));
  }

  // DeleteAsset deletes an given asset from the world state.
  async DeleteAsset(ctx, id) {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return ctx.stub.deleteState(id);
  }

  // AssetExists returns true when asset with given ID exists in world state.
  async AssetExists(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }

  // TransferAsset updates the owner field of asset with given id in the world state.
  async TransferAsset(ctx, id, newOwner) {
    const assetString = await this.ReadAsset(ctx, id);
    const asset = JSON.parse(assetString);
    asset.Owner = newOwner;
    return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
  }

  async GetHistory(ctx, id) {
    let iterator = await ctx.stub.getHistoryForKey(id);
    let result = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value) {
        console.info(
          `found state update with value: ${res.value.value.toString("utf8")}`
        );
        const obj = JSON.parse(res.value.value.toString("utf8"));
        result.push(obj);
      }
      res = await iterator.next();
    }
    await iterator.close();
    return result;
  }

  // GetAllAssets returns all asset./network.sh deployCC -ccn basic -ccl javascripts found in the world state.
  async GetAllAssets(ctx) {
    const allResults = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }

      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }

  //Get facility wise data
  async GetFacilityWise(ctx, facilityId) {
    let allResults = [];
    let incomingAsset = [];
    let outgoingAsset = [];
    let storedAssets = [];
    let totalStoredAssets = 0;

    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }

      allResults.push(record);
      result = await iterator.next();
    }

    allResults.forEach((el) => {
      if (el.owner.id == facilityId) {
        if (el.status === "STORED") {
          storedAssets.push(el);
          totalStoredAssets += el.quantity;
        } else if (el.status == "TRANSIT") {
          if (el.dispatch.from.id == facilityId) {
            outgoingAsset.push(el);
          } else if (el.dispatch.to.id == facilityId) {
            incomingAsset.push(el);
          }
        }
      }
    });

    return { incomingAsset, outgoingAsset, storedAssets, totalStoredAssets };
  }
}

module.exports = AssetTransfer;
