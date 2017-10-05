'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (centerX, centerY, angle, size) {
  var gl = store.get('gl');
  gl.dotScreen = gl.dotScreen || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform vec2 center;\
    uniform float angle;\
    uniform float scale;\
    uniform vec2 texSize;\
    varying vec2 texCoord;\
    \
    float pattern() {\
      float s = sin(angle), c = cos(angle);\
      vec2 tex = texCoord * texSize - center;\
      vec2 point = vec2(\
        c * tex.x - s * tex.y,\
        s * tex.x + c * tex.y\
      ) * scale;\
      return (sin(point.x) * sin(point.y)) * 4.0;\
    }\
    \
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      float average = (color.r + color.g + color.b) / 3.0;\
      gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\
    }\
  ');

  _util.simpleShader.call(this, gl.dotScreen, {
    center: [centerX, centerY],
    angle: angle,
    scale: Math.PI / size,
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