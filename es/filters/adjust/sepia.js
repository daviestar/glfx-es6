'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (amount) {
  var gl = store.get('gl');
  gl.sepia = gl.sepia || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float amount;\
    varying vec2 texCoord;\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      float r = color.r;\
      float g = color.g;\
      float b = color.b;\
      \
      color.r = min(1.0, (r * (1.0 - (0.607 * amount))) + (g * (0.769 * amount)) + (b * (0.189 * amount)));\
      color.g = min(1.0, (r * 0.349 * amount) + (g * (1.0 - (0.314 * amount))) + (b * 0.168 * amount));\
      color.b = min(1.0, (r * 0.272 * amount) + (g * 0.534 * amount) + (b * (1.0 - (0.869 * amount))));\
      \
      gl_FragColor = color;\
    }\
  ');

  _util.simpleShader.call(this, gl.sepia, {
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