'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (size, amount) {
  var gl = store.get('gl');
  gl.vignette = gl.vignette || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float size;\
    uniform float amount;\
    varying vec2 texCoord;\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      \
      float dist = distance(texCoord, vec2(0.5, 0.5));\
      color.rgb *= smoothstep(0.8, size * 0.799, dist * (amount + size));\
      \
      gl_FragColor = color;\
    }\
  ');

  _util.simpleShader.call(this, gl.vignette, {
    size: (0, _util.clamp)(0, size, 1),
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