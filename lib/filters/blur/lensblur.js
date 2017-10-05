'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (radius, brightness, angle) {
  var gl = store.get('gl');
  // All averaging is done on values raised to a power to make more obvious bokeh
  // (we will raise the average to the inverse power at the end to compensate).
  // Without this the image looks almost like a normal blurred image. This hack is
  // obviously not realistic, but to accurately simulate this we would need a high
  // dynamic range source photograph which we don't have.
  gl.lensBlurPrePass = gl.lensBlurPrePass || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float power;\
    varying vec2 texCoord;\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      color = pow(color, vec4(power));\
      gl_FragColor = vec4(color);\
    }\
  ');

  var common = '\
    uniform sampler2D texture0;\
    uniform sampler2D texture1;\
    uniform vec2 delta0;\
    uniform vec2 delta1;\
    uniform float power;\
    varying vec2 texCoord;\
    ' + _common.randomShaderFunc + '\
    vec4 sample(vec2 delta) {\
      /* randomize the lookup values to hide the fixed number of samples */\
      float offset = random(vec3(delta, 151.7182), 0.0);\
      \
      vec4 color = vec4(0.0);\
      float total = 0.0;\
      for (float t = 0.0; t <= 30.0; t++) {\
        float percent = (t + offset) / 30.0;\
        color += texture2D(texture0, texCoord + delta * percent);\
        total += 1.0;\
      }\
      return color / total;\
    }\
  ';

  gl.lensBlur0 = gl.lensBlur0 || new _shader2.default(null, common + '\
    void main() {\
      gl_FragColor = sample(delta0);\
    }\
  ');
  gl.lensBlur1 = gl.lensBlur1 || new _shader2.default(null, common + '\
    void main() {\
      gl_FragColor = (sample(delta0) + sample(delta1)) * 0.5;\
    }\
  ');
  gl.lensBlur2 = gl.lensBlur2 || new _shader2.default(null, common + '\
    void main() {\
      vec4 color = (sample(delta0) + 2.0 * texture2D(texture1, texCoord)) / 3.0;\
      gl_FragColor = pow(color, vec4(power));\
    }\
  ').textures({ texture1: 1 });

  // Generate
  var dir = [];
  for (var i = 0; i < 3; i++) {
    var a = angle + i * Math.PI * 2 / 3;
    dir.push([radius * Math.sin(a) / this.width, radius * Math.cos(a) / this.height]);
  }
  var power = Math.pow(10, (0, _util.clamp)(-1, brightness, 1));

  // Remap the texture values, which will help make the bokeh effect
  _util.simpleShader.call(this, gl.lensBlurPrePass, {
    power: power
  });

  // Blur two rhombi in parallel into extraTexture
  this._.extraTexture.ensureFormat(this._.texture);
  _util.simpleShader.call(this, gl.lensBlur0, {
    delta0: dir[0]
  }, this._.texture, this._.extraTexture);
  _util.simpleShader.call(this, gl.lensBlur1, {
    delta0: dir[1],
    delta1: dir[2]
  }, this._.extraTexture, this._.extraTexture);

  // Blur the last rhombus and combine with extraTexture
  _util.simpleShader.call(this, gl.lensBlur0, {
    delta0: dir[1]
  });
  this._.extraTexture.use(1);
  _util.simpleShader.call(this, gl.lensBlur2, {
    power: 1 / power,
    delta0: dir[2]
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