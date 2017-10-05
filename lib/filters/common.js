'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomShaderFunc = undefined;
exports.warpShader = warpShader;

var _shader = require('../shader');

var _shader2 = _interopRequireDefault(_shader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function warpShader(uniforms, warp) {
  return new _shader2.default(null, uniforms + '\
    uniform sampler2D texture;\
    uniform vec2 texSize;\
    varying vec2 texCoord;\
    void main() {\
      vec2 coord = texCoord * texSize;\
      ' + warp + '\
      gl_FragColor = texture2D(texture, coord / texSize);\
      vec2 clampedCoord = clamp(coord, vec2(0.0), texSize);\
      if (coord != clampedCoord) {\
        /* fade to transparent if we are outside the image */\
        gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));\
      }\
    }');
}

// returns a random number between 0 and 1
var randomShaderFunc = exports.randomShaderFunc = '\
  float random(vec3 scale, float seed) {\
    /* use the fragment position for a different seed per-pixel */\
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\
  }\
';