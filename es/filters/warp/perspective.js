'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (before, after) {
  var a = _matrix.getSquareToQuad.apply(null, after);
  var b = _matrix.getSquareToQuad.apply(null, before);
  var c = (0, _matrix.multiply)((0, _matrix.getInverse)(a), b);
  return this.matrixWarp(c);
};

var _matrix = require('../../matrix');