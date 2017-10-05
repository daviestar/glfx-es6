'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (exponent) {
  var gl = store.get('gl');
  // Do a 9x9 bilateral box filter
  gl.denoise = gl.denoise || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float exponent;\
    uniform float strength;\
    uniform vec2 texSize;\
    varying vec2 texCoord;\
    void main() {\
      vec4 center = texture2D(texture, texCoord);\
      vec4 color = vec4(0.0);\
      float total = 0.0;\
      for (float x = -4.0; x <= 4.0; x += 1.0) {\
        for (float y = -4.0; y <= 4.0; y += 1.0) {\
          vec4 sample = texture2D(texture, texCoord + vec2(x, y) / texSize);\
          float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));\
          weight = pow(weight, exponent);\
          color += sample * weight;\
          total += weight;\
        }\
      }\
      gl_FragColor = color / total;\
    }\
  ');

  // Perform two iterations for stronger results
  for (var i = 0; i < 2; i++) {
    _util.simpleShader.call(this, gl.denoise, {
      exponent: Math.max(0, exponent),
      texSize: [this.width, this.height]
    });
  }

  return this;
};

var _shader = require('../../shader');

var _shader2 = _interopRequireDefault(_shader);

var _util = require('../../util');

var _store = require('../../store');

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }