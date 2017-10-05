'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (radius) {
  var gl = store.get('gl');
  gl.edgeWork1 = gl.edgeWork1 || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform vec2 delta;\
    varying vec2 texCoord;\
    ' + _common.randomShaderFunc + '\
    void main() {\
      vec2 color = vec2(0.0);\
      vec2 total = vec2(0.0);\
      \
      /* randomize the lookup values to hide the fixed number of samples */\
      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
      \
      for (float t = -30.0; t <= 30.0; t++) {\
        float percent = (t + offset - 0.5) / 30.0;\
        float weight = 1.0 - abs(percent);\
        vec3 sample = texture2D(texture, texCoord + delta * percent).rgb;\
        float average = (sample.r + sample.g + sample.b) / 3.0;\
        color.x += average * weight;\
        total.x += weight;\
        if (abs(t) < 15.0) {\
          weight = weight * 2.0 - 1.0;\
          color.y += average * weight;\
          total.y += weight;\
        }\
      }\
      gl_FragColor = vec4(color / total, 0.0, 1.0);\
    }\
  ');

  gl.edgeWork2 = gl.edgeWork2 || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform vec2 delta;\
    varying vec2 texCoord;\
    ' + _common.randomShaderFunc + '\
    void main() {\
      vec2 color = vec2(0.0);\
      vec2 total = vec2(0.0);\
      \
      /* randomize the lookup values to hide the fixed number of samples */\
      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
      \
      for (float t = -30.0; t <= 30.0; t++) {\
        float percent = (t + offset - 0.5) / 30.0;\
        float weight = 1.0 - abs(percent);\
        vec2 sample = texture2D(texture, texCoord + delta * percent).xy;\
        color.x += sample.x * weight;\
        total.x += weight;\
        if (abs(t) < 15.0) {\
          weight = weight * 2.0 - 1.0;\
          color.y += sample.y * weight;\
          total.y += weight;\
        }\
      }\
      float c = clamp(10000.0 * (color.y / total.y - color.x / total.x) + 0.5, 0.0, 1.0);\
      gl_FragColor = vec4(c, c, c, 1.0);\
    }\
  ');

  _util.simpleShader.call(this, gl.edgeWork1, {
    delta: [radius / this.width, 0]
  });
  _util.simpleShader.call(this, gl.edgeWork2, {
    delta: [0, radius / this.height]
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