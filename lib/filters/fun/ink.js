'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (strength) {
  var gl = store.get('gl');
  gl.ink = gl.ink || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float strength;\
    uniform vec2 texSize;\
    varying vec2 texCoord;\
    void main() {\
      vec2 dx = vec2(1.0 / texSize.x, 0.0);\
      vec2 dy = vec2(0.0, 1.0 / texSize.y);\
      vec4 color = texture2D(texture, texCoord);\
      float bigTotal = 0.0;\
      float smallTotal = 0.0;\
      vec3 bigAverage = vec3(0.0);\
      vec3 smallAverage = vec3(0.0);\
      for (float x = -2.0; x <= 2.0; x += 1.0) {\
        for (float y = -2.0; y <= 2.0; y += 1.0) {\
          vec3 sample = texture2D(texture, texCoord + dx * x + dy * y).rgb;\
          bigAverage += sample;\
          bigTotal += 1.0;\
          if (abs(x) + abs(y) < 2.0) {\
            smallAverage += sample;\
            smallTotal += 1.0;\
          }\
        }\
      }\
      vec3 edge = max(vec3(0.0), bigAverage / bigTotal - smallAverage / smallTotal);\
      gl_FragColor = vec4(color.rgb - dot(edge, edge) * strength * 100000.0, color.a);\
    }\
  ');

  _util.simpleShader.call(this, gl.ink, {
    strength: strength * strength * strength * strength * strength,
    texSize: [this.width, this.height]
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