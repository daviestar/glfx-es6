'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (hue, saturation) {
  var gl = store.get('gl');
  gl.hueSaturation = gl.hueSaturation || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float hue;\
    uniform float saturation;\
    varying vec2 texCoord;\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      \
      /* hue adjustment, wolfram alpha: RotationTransform[angle, {1, 1, 1}][{x, y, z}] */\
      float angle = hue * 3.14159265;\
      float s = sin(angle), c = cos(angle);\
      vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;\
      float len = length(color.rgb);\
      color.rgb = vec3(\
        dot(color.rgb, weights.xyz),\
        dot(color.rgb, weights.zxy),\
        dot(color.rgb, weights.yzx)\
      );\
      \
      /* saturation adjustment */\
      float average = (color.r + color.g + color.b) / 3.0;\
      if (saturation > 0.0) {\
        color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));\
      } else {\
        color.rgb += (average - color.rgb) * (-saturation);\
      }\
      \
      gl_FragColor = color;\
    }\
  ');

  _util.simpleShader.call(this, gl.hueSaturation, {
    hue: (0, _util.clamp)(-1, hue, 1),
    saturation: (0, _util.clamp)(-1, saturation, 1)
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