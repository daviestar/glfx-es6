'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (matrix, inverse, useTextureSpace) {
  var gl = store.get('gl');
  gl.matrixWarp = gl.matrixWarp || (0, _common.warpShader)('\
    uniform mat3 matrix;\
    uniform bool useTextureSpace;\
  ', '\
    if (useTextureSpace) coord = coord / texSize * 2.0 - 1.0;\
    vec3 warp = matrix * vec3(coord, 1.0);\
    coord = warp.xy / warp.z;\
    if (useTextureSpace) coord = (coord * 0.5 + 0.5) * texSize;\
  ');

  // Flatten all members of matrix into one big list
  matrix = Array.prototype.concat.apply([], matrix);

  // Extract a 3x3 matrix out of the arguments
  if (matrix.length == 4) {
    matrix = [matrix[0], matrix[1], 0, matrix[2], matrix[3], 0, 0, 0, 1];
  } else if (matrix.length != 9) {
    throw 'can only warp with 2x2 or 3x3 matrix';
  }

  _util.simpleShader.call(this, gl.matrixWarp, {
    matrix: inverse ? (0, _matrix.getInverse)(matrix) : matrix,
    texSize: [this.width, this.height],
    useTextureSpace: useTextureSpace | 0
  });

  return this;
};

var _common = require('../common');

var _matrix = require('../../matrix');

var _util = require('../../util');

var _store = require('../../store');

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }