/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const vaccineTransfer = require("./lib/vaccineTransfer");

module.exports.AssetTransfer = vaccineTransfer;
module.exports.contracts = [vaccineTransfer];
