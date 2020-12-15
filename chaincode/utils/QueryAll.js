async function QueryAll(ctx) {
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
    console.log();
    allResults.push(record);
    result = await iterator.next();
  }
  return allResults;
}
module.exports = { QueryAll };
