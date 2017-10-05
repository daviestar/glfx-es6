'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (centerX, centerY, strength) {
  var gl = store.get('gl');
  gl.zoomBlur = gl.zoomBlur || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform vec2 center;\
    uniform float strength;\
    uniform vec2 texSize;\
    varying vec2 texCoord;\
    ' + _common.randomShaderFunc + '\
    void main() {\
      vec4 color = vec4(0.0);\
      float total = 0.0;\
      vec2 toCenter = center - texCoord * texSize;\
      \
      /* randomize the lookup values to hide the fixed number of samples */\
      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
      \
      for (float t = 0.0; t <= 40.0; t++) {\
        float percent = (t + offset) / 40.0;\
        float weight = 4.0 * (percent - percent * percent);\
        vec4 sample = texture2D(texture, texCoord + toCenter * percent * strength / texSize);\
        \
        /* switch to pre-multiplied alpha to correctly blur transparent images */\
        sample.rgb *= sample.a;\
        \
        color += sample * weight;\
        total += weight;\
      }\
      \
      gl_FragColor = color / total;\
      \
      /* switch back from pre-multiplied alpha */\
      gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\
    }\
  ');

  _util.simpleShader.call(this, gl.zoomBlur, {
    center: [centerX, centerY],
    strength: strength,
    texSize: [this.width, this.height]
  });

  return this;
};

var _shader = require('../../shader');

var _shader2 = _interopRequireDefault(_shader);

var _util = require('../../util');

var _common = require('../common');

var _store = require('../../store');

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }