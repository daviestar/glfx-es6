'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (amount) {
  var gl = store.get('gl');
  gl.noise = gl.noise || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float amount;\
    varying vec2 texCoord;\
    float rand(vec2 co) {\
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\
    }\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      \
      float diff = (rand(texCoord) - 0.5) * amount;\
      color.r += diff;\
      color.g += diff;\
      color.b += diff;\
      \
      gl_FragColor = color;\
    }\
  ');

  _util.simpleShader.call(this, gl.noise, {
    amount: (0, _util.clamp)(0, amount, 1)
  });

  return this;
};

var _shader = require('../../shader');

var _shader2 = _interopRequireDefault(_shader);

var _util = require('../../util');

var _store = require('../../store');

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }