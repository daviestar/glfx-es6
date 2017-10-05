'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (centerX, centerY, radius, angle) {
  var gl = store.get('gl');
  gl.swirl = gl.swirl || (0, _common.warpShader)('\
    uniform float radius;\
    uniform float angle;\
    uniform vec2 center;\
  ', '\
    coord -= center;\
    float distance = length(coord);\
    if (distance < radius) {\
      float percent = (radius - distance) / radius;\
      float theta = percent * percent * angle;\
      float s = sin(theta);\
      float c = cos(theta);\
      coord = vec2(\
        coord.x * c - coord.y * s,\
        coord.x * s + coord.y * c\
      );\
    }\
    coord += center;\
  ');

  _util.simpleShader.call(this, gl.swirl, {
    radius: radius,
    center: [centerX, centerY],
    angle: angle,
    texSize: [this.width, this.height]
  });

  return this;
};

var _common = require('../common');

var _util = require('../../util');

var _store = require('../../store');

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }