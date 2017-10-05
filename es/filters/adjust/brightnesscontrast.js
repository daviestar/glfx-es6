'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (brightness, contrast) {
  var gl = store.get('gl');
  gl.brightnessContrast = gl.brightnessContrast || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float brightness;\
    uniform float contrast;\
    varying vec2 texCoord;\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      color.rgb += brightness;\
      if (contrast > 0.0) {\
        color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;\
      } else {\
        color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;\
      }\
      gl_FragColor = color;\
    }\
  ');

  _util.simpleShader.call(this, gl.brightnessContrast, {
    brightness: (0, _util.clamp)(-1, brightness, 1),
    contrast: (0, _util.clamp)(-1, contrast, 1)
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