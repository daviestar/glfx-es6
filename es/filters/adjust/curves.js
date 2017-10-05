'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (red, green, blue) {
  var gl = store.get('gl');
  // Create the ramp texture
  red = (0, _util.splineInterpolate)(red);
  if (arguments.length == 1) {
    green = blue = red;
  } else {
    green = (0, _util.splineInterpolate)(green);
    blue = (0, _util.splineInterpolate)(blue);
  }
  var array = [];
  for (var i = 0; i < 256; i++) {
    array.splice(array.length, 0, red[i], green[i], blue[i], 255);
  }
  this._.extraTexture.initFromBytes(256, 1, array);
  this._.extraTexture.use(1);

  gl.curves = gl.curves || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform sampler2D map;\
    varying vec2 texCoord;\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      color.r = texture2D(map, vec2(color.r)).r;\
      color.g = texture2D(map, vec2(color.g)).g;\
      color.b = texture2D(map, vec2(color.b)).b;\
      gl_FragColor = color;\
    }\
  ');

  gl.curves.textures({
    map: 1
  });
  _util.simpleShader.call(this, gl.curves, {});

  return this;
};

var _shader = require('../../shader');

var _shader2 = _interopRequireDefault(_shader);

var _util = require('../../util');

var _store = require('../../store');

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }