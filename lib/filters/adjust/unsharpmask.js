'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (radius, strength) {
  var gl = store.get('gl');
  gl.unsharpMask = gl.unsharpMask || new _shader2.default(null, '\
    uniform sampler2D blurredTexture;\
    uniform sampler2D originalTexture;\
    uniform float strength;\
    uniform float threshold;\
    varying vec2 texCoord;\
    void main() {\
      vec4 blurred = texture2D(blurredTexture, texCoord);\
      vec4 original = texture2D(originalTexture, texCoord);\
      gl_FragColor = mix(blurred, original, 1.0 + strength);\
    }\
  ');

  // Store a copy of the current texture in the second texture unit
  this._.extraTexture.ensureFormat(this._.texture);
  this._.texture.use();
  this._.extraTexture.drawTo(function () {
    _shader2.default.getDefaultShader().drawRect();
  });

  // Blur the current texture, then use the stored texture to detect edges
  this._.extraTexture.use(1);
  this.triangleBlur(radius);
  gl.unsharpMask.textures({
    originalTexture: 1
  });
  _util.simpleShader.call(this, gl.unsharpMask, {
    strength: strength
  });
  this._.extraTexture.unuse(1);

  return this;
};

var _shader = require('../../shader');

var _shader2 = _interopRequireDefault(_shader);

var _util = require('../../util');

var _store = require('../../store');

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }