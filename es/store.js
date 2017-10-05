"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
exports.get = get;
var store = {};

function set(obj) {
  store = Object.assign(store, obj);
}

function get(key) {
  return store[key];
}