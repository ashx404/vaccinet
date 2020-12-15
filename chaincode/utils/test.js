const Asset = require("../lib/asset");
let incomingAsset = [];
let outgoingAsset = [];
let storedAssets = [];
let totalStoredAssets = 0;
let facilityId = "gupta99piyush";
let x = [
  {
    status: "STORED",
    quantity: 100,
    temp: "-10",
    owner: {
      id: "gupta99piyush",
      date: 1608042802205,
      address: "P-101 Sector-2, Main facility, Nazafgarh,New Delhi-110045",
      coordinates: { longitude: "71.323234", latitude: "20.343453" },
      name: "New Pharma Co",
    },
    timestamp: 1608042802205,
    id: "6e554d58-bcee-4fca-b5d3-87d1c73962fc",
  },
  {
    status: "STORED",
    quantity: 100,
    temp: 0,
    owner: {
      id: "gupta99piyush",
      date: 1608042789097,
      address: "P-101 Sector-2, Main facility, Nazafgarh,New Delhi-110045",
      coordinates: { longitude: "71.323234", latitude: "20.343453" },
      name: "New Pharma Co",
    },
    timestamp: 1608042789097,
    id: "9f56b5fe-44eb-4061-86d5-dc5fc93f8dcd",
  },
  {
    status: "STORED",
    quantity: 100,
    temp: "-20",
    owner: {
      id: "gupta99piyush",
      date: 1608042813643,
      address: "P-101 Sector-2, Main facility, Nazafgarh,New Delhi-110045",
      coordinates: { longitude: "71.323234", latitude: "20.343453" },
      name: "New Pharma Co",
    },
    timestamp: 1608042813643,
    id: "f3250fc6-d265-42e8-af75-34ff299188c0",
  },
];
x.forEach((el) => {
  if (el.owner.id == facilityId) {
    console.log("Heelo");
    if (el.status == "STORED") {
      console.log("Raju");
      storedAssets.push(el);
      totalStoredAssets += el.quantity;
    } else if (el.status == "TRANSIT") {
      if (el.dispatchDetails.from == facilityId) {
        outgoingAsset.push(el);
      } else if (el.dispatchDetails.to == facilityId) {
        incomingAsset.push(el);
      }
    }
  }
});

console.log(incomingAsset, outgoingAsset, storedAssets, totalStoredAssets);
