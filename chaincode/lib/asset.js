"use strict";

/**
 * Possible asset states
 */
const state = {
  STORED: "IN STORAGE",
  MOVING: "IN TRANSIT",
  DESTROYED: "DESTROYED",
  USED: "USED",
};

/**
 * Asset class extends State class
 */
class Asset {
  constructor(assetKey, assetInfo) {
    this.key = assetKey;
    this.currentState = null;
    Object.assign(this, assetInfo);
  }

  /**
   * Getters and setters
   */
  getAsset() {
    return this;
  }

  setAsset(newData) {
    Object.assign(this, newData);
  }

  getStatus() {
    return this.currentState;
  }

  /**
   * Methods to encapsulate asset state changes
   * And query about a specific status
   */

  setStored() {
    this.currentState = state.STORED;
  }

  isStored() {
    return this.currentState === state.STORED;
  }

  setMoving() {
    this.currentState = state.MOVING;
  }

  isMoving() {
    return this.currentState === state.MOVING;
  }

  setDestroyed() {
    this.curassetKeyassetKeyrentState = state.DESTROYED;
  }

  isDestroyed() {
    return this.currentState === state.DESTROYED;
  }
  setUsed() {
    this.currentState = state.USED;
  }

  isUsed() {
    return this.currentState === state.USED;
  }
}

module.exports = Asset;
