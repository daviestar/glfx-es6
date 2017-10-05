'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (amount) {
  var gl = store.get('gl');
  gl.vibrance = gl.vibrance || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float amount;\
    varying vec2 texCoord;\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      float average = (color.r + color.g + color.b) / 3.0;\
      float mx = max(color.r, max(color.g, color.b));\
      float amt = (mx - average) * (-amount * 3.0);\
      color.rgb = mix(color.rgb, vec3(mx), amt);\
      gl_FragColor = color;\
    }\
  ');

  _util.simpleShader.call(this, gl.vibrance, {
    amount: (0, _util.clamp)(-1, amount, 1)
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