'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (startX, startY, endX, endY, blurRadius, gradientRadius) {
  var gl = store.get('gl');
  gl.tiltShift = gl.tiltShift || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float blurRadius;\
    uniform float gradientRadius;\
    uniform vec2 start;\
    uniform vec2 end;\
    uniform vec2 delta;\
    uniform vec2 texSize;\
    varying vec2 texCoord;\
    ' + _common.randomShaderFunc + '\
    void main() {\
      vec4 color = vec4(0.0);\
      float total = 0.0;\
      \
      /* randomize the lookup values to hide the fixed number of samples */\
      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
      \
      vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\
      float radius = smoothstep(0.0, 1.0, abs(dot(texCoord * texSize - start, normal)) / gradientRadius) * blurRadius;\
      for (float t = -30.0; t <= 30.0; t++) {\
        float percent = (t + offset - 0.5) / 30.0;\
        float weight = 1.0 - abs(percent);\
        vec4 sample = texture2D(texture, texCoord + delta / texSize * percent * radius);\
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

  var dx = endX - startX;
  var dy = endY - startY;
  var d = Math.sqrt(dx * dx + dy * dy);
  _util.simpleShader.call(this, gl.tiltShift, {
    blurRadius: blurRadius,
    gradientRadius: gradientRadius,
    start: [startX, startY],
    end: [endX, endY],
    delta: [dx / d, dy / d],
    texSize: [this.width, this.height]
  });
  _util.simpleShader.call(this, gl.tiltShift, {
    blurRadius: blurRadius,
    gradientRadius: gradientRadius,
    start: [startX, startY],
    end: [endX, endY],
    delta: [-dy / d, dx / d],
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