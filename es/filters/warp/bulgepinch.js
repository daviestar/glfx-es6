'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (centerX, centerY, radius, strength) {
  var gl = store.get('gl');
  gl.bulgePinch = gl.bulgePinch || (0, _common.warpShader)('\
    uniform float radius;\
    uniform float strength;\
    uniform vec2 center;\
  ', '\
    coord -= center;\
    float distance = length(coord);\
    if (distance < radius) {\
      float percent = distance / radius;\
      if (strength > 0.0) {\
        coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\
      } else {\
        coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\
      }\
    }\
    coord += center;\
  ');

  _util.simpleShader.call(this, gl.bulgePinch, {
    radius: radius,
    strength: (0, _util.clamp)(-1, strength, 1),
    center: [centerX, centerY],
    texSize: [this.width, this.height]
  });

  return this;
};

var _common = require('../common');

var _util = require('../../util');

var _store = require('../../store');

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }