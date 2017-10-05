(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("fx", [], factory);
	else if(typeof exports === 'object')
		exports["fx"] = factory();
	else
		root["fx"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
exports.get = get;
var store = {};

function set(obj) {
  store = Object.assign(store, obj);
}

function get(key) {
  return store[key];
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simpleShader = simpleShader;
exports.clamp = clamp;
exports.splineInterpolate = splineInterpolate;

var _spline = __webpack_require__(6);

var _spline2 = _interopRequireDefault(_spline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function simpleShader(shader, uniforms, textureIn, textureOut) {
  (textureIn || this._.texture).use();
  this._.spareTexture.drawTo(function () {
    shader.uniforms(uniforms).drawRect();
  });
  this._.spareTexture.swapWith(textureOut || this._.texture);
}

function clamp(lo, value, hi) {
  return Math.max(lo, Math.min(value, hi));
}

function splineInterpolate(points) {
  var interpolator = new _spline2.default(points);
  var array = [];
  for (var i = 0; i < 256; i++) {
    array.push(clamp(0, Math.floor(interpolator.interpolate(i / 255) * 256), 255));
  }
  return array;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultVertexSource = '\
attribute vec2 vertex;\
attribute vec2 _texCoord;\
varying vec2 texCoord;\
void main() {\
  texCoord = _texCoord;\
  gl_Position = vec4(vertex * 2.0 - 1.0, 0.0, 1.0);\
}';

var defaultFragmentSource = '\
uniform sampler2D texture;\
varying vec2 texCoord;\
void main() {\
  gl_FragColor = texture2D(texture, texCoord);\
}';

var Shader = function () {
  _createClass(Shader, null, [{
    key: 'getDefaultShader',
    value: function getDefaultShader() {
      var gl = store.get('gl');
      gl.defaultShader = gl.defaultShader || new Shader();
      return gl.defaultShader;
    }
  }]);

  function Shader(vertexSource, fragmentSource) {
    _classCallCheck(this, Shader);

    var gl = store.get('gl');
    this.vertexAttribute = null;
    this.texCoordAttribute = null;
    this.program = gl.createProgram();
    vertexSource = vertexSource || defaultVertexSource;
    fragmentSource = fragmentSource || defaultFragmentSource;
    fragmentSource = 'precision highp float;' + fragmentSource; // annoying requirement is annoying
    gl.attachShader(this.program, compileSource(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(this.program, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw 'link error: ' + gl.getProgramInfoLog(this.program);
    }
  }

  _createClass(Shader, [{
    key: 'destroy',
    value: function destroy() {
      var gl = store.get('gl');
      gl.deleteProgram(this.program);
      this.program = null;
    }
  }, {
    key: 'uniforms',
    value: function uniforms(_uniforms) {
      var gl = store.get('gl');
      gl.useProgram(this.program);
      for (var name in _uniforms) {
        if (!_uniforms.hasOwnProperty(name)) continue;
        var location = gl.getUniformLocation(this.program, name);
        if (location === null) continue; // will be null if the uniform isn't used in the shader
        var value = _uniforms[name];
        if (isArray(value)) {
          switch (value.length) {
            case 1:
              gl.uniform1fv(location, new Float32Array(value));break;
            case 2:
              gl.uniform2fv(location, new Float32Array(value));break;
            case 3:
              gl.uniform3fv(location, new Float32Array(value));break;
            case 4:
              gl.uniform4fv(location, new Float32Array(value));break;
            case 9:
              gl.uniformMatrix3fv(location, false, new Float32Array(value));break;
            case 16:
              gl.uniformMatrix4fv(location, false, new Float32Array(value));break;
            default:
              throw 'dont\'t know how to load uniform "' + name + '" of length ' + value.length;
          }
        } else if (isNumber(value)) {
          gl.uniform1f(location, value);
        } else {
          throw 'attempted to set uniform "' + name + '" to invalid value ' + (value || 'undefined').toString();
        }
      }
      // allow chaining
      return this;
    }

    // textures are uniforms too but for some reason can't be specified by gl.uniform1f,
    // even though floating point numbers represent the integers 0 through 7 exactly

  }, {
    key: 'textures',
    value: function textures(_textures) {
      var gl = store.get('gl');
      gl.useProgram(this.program);
      for (var name in _textures) {
        if (!_textures.hasOwnProperty(name)) continue;
        gl.uniform1i(gl.getUniformLocation(this.program, name), _textures[name]);
      }
      // allow chaining
      return this;
    }
  }, {
    key: 'drawRect',
    value: function drawRect(left, top, right, bottom) {
      var gl = store.get('gl');
      var viewport = gl.getParameter(gl.VIEWPORT);
      top = top !== undefined ? (top - viewport[1]) / viewport[3] : 0;
      left = left !== undefined ? (left - viewport[0]) / viewport[2] : 0;
      right = right !== undefined ? (right - viewport[0]) / viewport[2] : 1;
      bottom = bottom !== undefined ? (bottom - viewport[1]) / viewport[3] : 1;
      if (gl.vertexBuffer == null) {
        gl.vertexBuffer = gl.createBuffer();
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([left, top, left, bottom, right, top, right, bottom]), gl.STATIC_DRAW);
      if (gl.texCoordBuffer == null) {
        gl.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
      }
      if (this.vertexAttribute == null) {
        this.vertexAttribute = gl.getAttribLocation(this.program, 'vertex');
        gl.enableVertexAttribArray(this.vertexAttribute);
      }
      if (this.texCoordAttribute == null) {
        this.texCoordAttribute = gl.getAttribLocation(this.program, '_texCoord');
        gl.enableVertexAttribArray(this.texCoordAttribute);
      }
      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
      gl.vertexAttribPointer(this.vertexAttribute, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
      gl.vertexAttribPointer(this.texCoordAttribute, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }]);

  return Shader;
}();

exports.default = Shader;


function isArray(obj) {
  return Object.prototype.toString.call(obj) == '[object Array]';
}

function isNumber(obj) {
  return Object.prototype.toString.call(obj) == '[object Number]';
}

function compileSource(type, source) {
  var gl = store.get('gl');
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw 'compile error: ' + gl.getShaderInfoLog(shader);
  }
  return shader;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomShaderFunc = undefined;
exports.warpShader = warpShader;

var _shader = __webpack_require__(2);

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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSquareToQuad = getSquareToQuad;
exports.getInverse = getInverse;
exports.multiply = multiply;
// from javax.media.jai.PerspectiveTransform

function getSquareToQuad(x0, y0, x1, y1, x2, y2, x3, y3) {
  var dx1 = x1 - x2;
  var dy1 = y1 - y2;
  var dx2 = x3 - x2;
  var dy2 = y3 - y2;
  var dx3 = x0 - x1 + x2 - x3;
  var dy3 = y0 - y1 + y2 - y3;
  var det = dx1 * dy2 - dx2 * dy1;
  var a = (dx3 * dy2 - dx2 * dy3) / det;
  var b = (dx1 * dy3 - dx3 * dy1) / det;
  return [x1 - x0 + a * x1, y1 - y0 + a * y1, a, x3 - x0 + b * x3, y3 - y0 + b * y3, b, x0, y0, 1];
}

function getInverse(m) {
  var a = m[0],
      b = m[1],
      c = m[2];
  var d = m[3],
      e = m[4],
      f = m[5];
  var g = m[6],
      h = m[7],
      i = m[8];
  var det = a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
  return [(e * i - f * h) / det, (c * h - b * i) / det, (b * f - c * e) / det, (f * g - d * i) / det, (a * i - c * g) / det, (c * d - a * f) / det, (d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det];
}

function multiply(a, b) {
  return [a[0] * b[0] + a[1] * b[3] + a[2] * b[6], a[0] * b[1] + a[1] * b[4] + a[2] * b[7], a[0] * b[2] + a[1] * b[5] + a[2] * b[8], a[3] * b[0] + a[4] * b[3] + a[5] * b[6], a[3] * b[1] + a[4] * b[4] + a[5] * b[7], a[3] * b[2] + a[4] * b[5] + a[5] * b[8], a[6] * b[0] + a[7] * b[3] + a[8] * b[6], a[6] * b[1] + a[7] * b[4] + a[8] * b[7], a[6] * b[2] + a[7] * b[5] + a[8] * b[8]];
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canvas = exports.splineInterpolate = undefined;

var _util = __webpack_require__(1);

Object.defineProperty(exports, 'splineInterpolate', {
  enumerable: true,
  get: function get() {
    return _util.splineInterpolate;
  }
});

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

var _texture = __webpack_require__(7);

var _texture2 = _interopRequireDefault(_texture);

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _filters = __webpack_require__(8);

var filters = _interopRequireWildcard(_filters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function wrapTexture(texture) {
  return {
    _: texture,
    loadContentsOf: function loadContentsOf(element) {
      // Make sure that we're using the correct global WebGL context
      store.set({ gl: this._.gl });
      this._.loadContentsOf(element);
    },
    destroy: function destroy() {
      // Make sure that we're using the correct global WebGL context
      store.set({ gl: this._.gl });
      this._.destroy();
    }
  };
}

function texture(element) {
  return wrapTexture(_texture2.default.fromElement(element));
}

function initialize(width, height) {
  var gl = store.get('gl');
  var type = gl.UNSIGNED_BYTE;

  // Go for floating point buffer textures if we can, it'll make the bokeh
  // filter look a lot better. Note that on Windows, ANGLE does not let you
  // render to a floating-point texture when linear filtering is enabled.
  // See http://crbug.com/172278 for more information.
  if (gl.getExtension('OES_texture_float') && gl.getExtension('OES_texture_float_linear')) {
    var testTexture = new _texture2.default(100, 100, gl.RGBA, gl.FLOAT);
    try {
      // Only use gl.FLOAT if we can render to it
      testTexture.drawTo(function () {
        type = gl.FLOAT;
      });
    } catch (e) {}
    testTexture.destroy();
  }

  if (this._.texture) this._.texture.destroy();
  if (this._.spareTexture) this._.spareTexture.destroy();
  this.width = width;
  this.height = height;
  this._.texture = new _texture2.default(width, height, gl.RGBA, type);
  this._.spareTexture = new _texture2.default(width, height, gl.RGBA, type);
  this._.extraTexture = this._.extraTexture || new _texture2.default(0, 0, gl.RGBA, type);
  this._.flippedShader = this._.flippedShader || new _shader2.default(null, '\
    uniform sampler2D texture;\
    varying vec2 texCoord;\
    void main() {\
      gl_FragColor = texture2D(texture, vec2(texCoord.x, 1.0 - texCoord.y));\
    }\
  ');
  this._.isInitialized = true;
}

/*
   Draw a texture to the canvas, with an optional width and height to scale to.
   If no width and height are given then the original texture width and height
   are used.
*/
function draw(texture, width, height) {
  if (!this._.isInitialized || texture._.width != this.width || texture._.height != this.height) {
    initialize.call(this, width ? width : texture._.width, height ? height : texture._.height);
  }

  texture._.use();
  this._.texture.drawTo(function () {
    _shader2.default.getDefaultShader().drawRect();
  });

  return this;
}

function update() {
  this._.texture.use();
  this._.flippedShader.drawRect();
  return this;
}

function replace(node) {
  node.parentNode.insertBefore(this, node);
  node.parentNode.removeChild(node);
  return this;
}

function contents() {
  var gl = store.get('gl');
  var texture = new _texture2.default(this._.texture.width, this._.texture.height, gl.RGBA, gl.UNSIGNED_BYTE);
  this._.texture.use();
  texture.drawTo(function () {
    _shader2.default.getDefaultShader().drawRect();
  });
  return wrapTexture(texture);
}

/*
   Get a Uint8 array of pixel values: [r, g, b, a, r, g, b, a, ...]
   Length of the array will be width * height * 4.
*/
function getPixelArray() {
  var gl = store.get('gl');
  var w = this._.texture.width;
  var h = this._.texture.height;
  var array = new Uint8Array(w * h * 4);
  this._.texture.drawTo(function () {
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, array);
  });
  return array;
}

function wrap(func) {
  return function () {
    // Make sure that we're using the correct global WebGL context
    store.set({ gl: this._.gl });

    // Now that the context has been switched, we can call the wrapped function
    return func.apply(this, arguments);
  };
}

var canvas = exports.canvas = function canvas() {
  var canvas = document.createElement('canvas');
  try {
    store.set({ gl: canvas.getContext('experimental-webgl', { premultipliedAlpha: false }) });
  } catch (e) {
    store.set({ gl: null });
  }
  var gl = store.get('gl');
  if (!gl) {
    throw 'This browser does not support WebGL';
  }
  canvas._ = {
    gl: gl,
    isInitialized: false,
    texture: null,
    spareTexture: null,
    flippedShader: null
  };

  // Core methods
  canvas.texture = wrap(texture);
  canvas.draw = wrap(draw);
  canvas.update = wrap(update);
  canvas.replace = wrap(replace);
  canvas.contents = wrap(contents);
  canvas.getPixelArray = wrap(getPixelArray);

  // // Filter methods
  canvas.brightnessContrast = wrap(filters.brightnessContrast);
  canvas.hexagonalPixelate = wrap(filters.hexagonalPixelate);
  canvas.hueSaturation = wrap(filters.hueSaturation);
  canvas.colorHalftone = wrap(filters.colorHalftone);
  canvas.triangleBlur = wrap(filters.triangleBlur);
  canvas.unsharpMask = wrap(filters.unsharpMask);
  canvas.perspective = wrap(filters.perspective);
  canvas.matrixWarp = wrap(filters.matrixWarp);
  canvas.bulgePinch = wrap(filters.bulgePinch);
  canvas.tiltShift = wrap(filters.tiltShift);
  canvas.dotScreen = wrap(filters.dotScreen);
  canvas.edgeWork = wrap(filters.edgeWork);
  canvas.lensBlur = wrap(filters.lensBlur);
  canvas.zoomBlur = wrap(filters.zoomBlur);
  canvas.noise = wrap(filters.noise);
  canvas.denoise = wrap(filters.denoise);
  canvas.curves = wrap(filters.curves);
  canvas.swirl = wrap(filters.swirl);
  canvas.ink = wrap(filters.ink);
  canvas.vignette = wrap(filters.vignette);
  canvas.vibrance = wrap(filters.vibrance);
  canvas.sepia = wrap(filters.sepia);

  return canvas;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// from SplineInterpolator.cs in the Paint.NET source code

var SplineInterpolator = function () {
  function SplineInterpolator(points) {
    _classCallCheck(this, SplineInterpolator);

    var n = points.length;
    this.xa = [];
    this.ya = [];
    this.u = [];
    this.y2 = [];

    points.sort(function (a, b) {
      return a[0] - b[0];
    });
    for (var i = 0; i < n; i++) {
      this.xa.push(points[i][0]);
      this.ya.push(points[i][1]);
    }

    this.u[0] = 0;
    this.y2[0] = 0;

    for (var i = 1; i < n - 1; ++i) {
      // This is the decomposition loop of the tridiagonal algorithm.
      // y2 and u are used for temporary storage of the decomposed factors.
      var wx = this.xa[i + 1] - this.xa[i - 1];
      var sig = (this.xa[i] - this.xa[i - 1]) / wx;
      var p = sig * this.y2[i - 1] + 2.0;

      this.y2[i] = (sig - 1.0) / p;

      var ddydx = (this.ya[i + 1] - this.ya[i]) / (this.xa[i + 1] - this.xa[i]) - (this.ya[i] - this.ya[i - 1]) / (this.xa[i] - this.xa[i - 1]);

      this.u[i] = (6.0 * ddydx / wx - sig * this.u[i - 1]) / p;
    }

    this.y2[n - 1] = 0;

    // This is the backsubstitution loop of the tridiagonal algorithm
    for (var i = n - 2; i >= 0; --i) {
      this.y2[i] = this.y2[i] * this.y2[i + 1] + this.u[i];
    }
  }

  _createClass(SplineInterpolator, [{
    key: "interpolate",
    value: function interpolate(x) {
      var n = this.ya.length;
      var klo = 0;
      var khi = n - 1;

      // We will find the right place in the table by means of
      // bisection. This is optimal if sequential calls to this
      // routine are at random values of x. If sequential calls
      // are in order, and closely spaced, one would do better
      // to store previous values of klo and khi.
      while (khi - klo > 1) {
        var k = khi + klo >> 1;

        if (this.xa[k] > x) {
          khi = k;
        } else {
          klo = k;
        }
      }

      var h = this.xa[khi] - this.xa[klo];
      var a = (this.xa[khi] - x) / h;
      var b = (x - this.xa[klo]) / h;

      // Cubic spline polynomial is now evaluated.
      return a * this.ya[klo] + b * this.ya[khi] + ((a * a * a - a) * this.y2[klo] + (b * b * b - b) * this.y2[khi]) * (h * h) / 6.0;
    }
  }]);

  return SplineInterpolator;
}();

exports.default = SplineInterpolator;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = null;

var Texture = function () {
  _createClass(Texture, null, [{
    key: 'fromElement',
    value: function fromElement(element) {
      var gl = store.get('gl');
      var texture = new Texture(0, 0, gl.RGBA, gl.UNSIGNED_BYTE);
      texture.loadContentsOf(element);
      return texture;
    }
  }]);

  function Texture(width, height, format, type) {
    _classCallCheck(this, Texture);

    var gl = store.get('gl');
    this.gl = gl;
    this.id = gl.createTexture();
    this.width = width;
    this.height = height;
    this.format = format;
    this.type = type;

    gl.bindTexture(gl.TEXTURE_2D, this.id);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (width && height) gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
  }

  _createClass(Texture, [{
    key: 'loadContentsOf',
    value: function loadContentsOf(element) {
      var gl = store.get('gl');
      this.width = element.width || element.videoWidth;
      this.height = element.height || element.videoHeight;
      gl.bindTexture(gl.TEXTURE_2D, this.id);
      gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, element);
    }
  }, {
    key: 'initFromBytes',
    value: function initFromBytes(width, height, data) {
      var gl = store.get('gl');
      this.width = width;
      this.height = height;
      this.format = gl.RGBA;
      this.type = gl.UNSIGNED_BYTE;
      gl.bindTexture(gl.TEXTURE_2D, this.id);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, this.type, new Uint8Array(data));
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var gl = store.get('gl');
      gl.deleteTexture(this.id);
      this.id = null;
    }
  }, {
    key: 'use',
    value: function use(unit) {
      var gl = store.get('gl');
      gl.activeTexture(gl.TEXTURE0 + (unit || 0));
      gl.bindTexture(gl.TEXTURE_2D, this.id);
    }
  }, {
    key: 'unuse',
    value: function unuse(unit) {
      var gl = store.get('gl');
      gl.activeTexture(gl.TEXTURE0 + (unit || 0));
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  }, {
    key: 'ensureFormat',
    value: function ensureFormat(width, height, format, type) {
      // allow passing an existing texture instead of individual arguments
      if (arguments.length == 1) {
        var texture = arguments[0];
        width = texture.width;
        height = texture.height;
        format = texture.format;
        type = texture.type;
      }

      // change the format only if required
      if (width != this.width || height != this.height || format != this.format || type != this.type) {
        var gl = store.get('gl');
        this.width = width;
        this.height = height;
        this.format = format;
        this.type = type;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
      }
    }
  }, {
    key: 'drawTo',
    value: function drawTo(callback) {
      var gl = store.get('gl');
      // start rendering to this texture
      gl.framebuffer = gl.framebuffer || gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, gl.framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('incomplete framebuffer');
      }
      gl.viewport(0, 0, this.width, this.height);

      // do the drawing
      callback();

      // stop rendering to this texture
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  }, {
    key: 'fillUsingCanvas',
    value: function fillUsingCanvas(callback) {
      callback(getCanvas(this));
      var gl = store.get('gl');
      this.format = gl.RGBA;
      this.type = gl.UNSIGNED_BYTE;
      gl.bindTexture(gl.TEXTURE_2D, this.id);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
      return this;
    }
  }, {
    key: 'toImage',
    value: function toImage(image) {
      this.use();
      _shader2.default.getDefaultShader().drawRect();
      var gl = store.get('gl');
      var size = this.width * this.height * 4;
      var pixels = new Uint8Array(size);
      var c = getCanvas(this);
      var data = c.createImageData(this.width, this.height);
      gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      for (var i = 0; i < size; i++) {
        data.data[i] = pixels[i];
      }
      c.putImageData(data, 0, 0);
      image.src = canvas.toDataURL();
    }
  }, {
    key: 'swapWith',
    value: function swapWith(other) {
      var temp;
      temp = other.id;other.id = this.id;this.id = temp;
      temp = other.width;other.width = this.width;this.width = temp;
      temp = other.height;other.height = this.height;this.height = temp;
      temp = other.format;other.format = this.format;this.format = temp;
    }
  }]);

  return Texture;
}();

exports.default = Texture;


function getCanvas(texture) {
  if (canvas == null) canvas = document.createElement('canvas');
  canvas.width = texture.width;
  canvas.height = texture.height;
  var c = canvas.getContext('2d');
  c.clearRect(0, 0, canvas.width, canvas.height);
  return c;
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _brightnesscontrast = __webpack_require__(9);

Object.defineProperty(exports, 'brightnessContrast', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_brightnesscontrast).default;
  }
});

var _curves = __webpack_require__(10);

Object.defineProperty(exports, 'curves', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_curves).default;
  }
});

var _denoise = __webpack_require__(11);

Object.defineProperty(exports, 'denoise', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_denoise).default;
  }
});

var _huesaturation = __webpack_require__(12);

Object.defineProperty(exports, 'hueSaturation', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_huesaturation).default;
  }
});

var _noise = __webpack_require__(13);

Object.defineProperty(exports, 'noise', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_noise).default;
  }
});

var _sepia = __webpack_require__(14);

Object.defineProperty(exports, 'sepia', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sepia).default;
  }
});

var _unsharpmask = __webpack_require__(15);

Object.defineProperty(exports, 'unsharpMask', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_unsharpmask).default;
  }
});

var _vibrance = __webpack_require__(16);

Object.defineProperty(exports, 'vibrance', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_vibrance).default;
  }
});

var _vignette = __webpack_require__(17);

Object.defineProperty(exports, 'vignette', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_vignette).default;
  }
});

var _lensblur = __webpack_require__(18);

Object.defineProperty(exports, 'lensBlur', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_lensblur).default;
  }
});

var _tiltshift = __webpack_require__(19);

Object.defineProperty(exports, 'tiltShift', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_tiltshift).default;
  }
});

var _triangleblur = __webpack_require__(20);

Object.defineProperty(exports, 'triangleBlur', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_triangleblur).default;
  }
});

var _zoomblur = __webpack_require__(21);

Object.defineProperty(exports, 'zoomBlur', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_zoomblur).default;
  }
});

var _colorhalftone = __webpack_require__(22);

Object.defineProperty(exports, 'colorHalftone', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_colorhalftone).default;
  }
});

var _dotscreen = __webpack_require__(23);

Object.defineProperty(exports, 'dotScreen', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_dotscreen).default;
  }
});

var _edgework = __webpack_require__(24);

Object.defineProperty(exports, 'edgeWork', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_edgework).default;
  }
});

var _hexagonalpixelate = __webpack_require__(25);

Object.defineProperty(exports, 'hexagonalPixelate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_hexagonalpixelate).default;
  }
});

var _ink = __webpack_require__(26);

Object.defineProperty(exports, 'ink', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ink).default;
  }
});

var _bulgepinch = __webpack_require__(27);

Object.defineProperty(exports, 'bulgePinch', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_bulgepinch).default;
  }
});

var _matrixwarp = __webpack_require__(28);

Object.defineProperty(exports, 'matrixWarp', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_matrixwarp).default;
  }
});

var _perspective = __webpack_require__(29);

Object.defineProperty(exports, 'perspective', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_perspective).default;
  }
});

var _swirl = __webpack_require__(30);

Object.defineProperty(exports, 'swirl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_swirl).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (exponent) {
  var gl = store.get('gl');
  // Do a 9x9 bilateral box filter
  gl.denoise = gl.denoise || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float exponent;\
    uniform float strength;\
    uniform vec2 texSize;\
    varying vec2 texCoord;\
    void main() {\
      vec4 center = texture2D(texture, texCoord);\
      vec4 color = vec4(0.0);\
      float total = 0.0;\
      for (float x = -4.0; x <= 4.0; x += 1.0) {\
        for (float y = -4.0; y <= 4.0; y += 1.0) {\
          vec4 sample = texture2D(texture, texCoord + vec2(x, y) / texSize);\
          float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));\
          weight = pow(weight, exponent);\
          color += sample * weight;\
          total += weight;\
        }\
      }\
      gl_FragColor = color / total;\
    }\
  ');

  // Perform two iterations for stronger results
  for (var i = 0; i < 2; i++) {
    _util.simpleShader.call(this, gl.denoise, {
      exponent: Math.max(0, exponent),
      texSize: [this.width, this.height]
    });
  }

  return this;
};

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (hue, saturation) {
  var gl = store.get('gl');
  gl.hueSaturation = gl.hueSaturation || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float hue;\
    uniform float saturation;\
    varying vec2 texCoord;\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      \
      /* hue adjustment, wolfram alpha: RotationTransform[angle, {1, 1, 1}][{x, y, z}] */\
      float angle = hue * 3.14159265;\
      float s = sin(angle), c = cos(angle);\
      vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;\
      float len = length(color.rgb);\
      color.rgb = vec3(\
        dot(color.rgb, weights.xyz),\
        dot(color.rgb, weights.zxy),\
        dot(color.rgb, weights.yzx)\
      );\
      \
      /* saturation adjustment */\
      float average = (color.r + color.g + color.b) / 3.0;\
      if (saturation > 0.0) {\
        color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));\
      } else {\
        color.rgb += (average - color.rgb) * (-saturation);\
      }\
      \
      gl_FragColor = color;\
    }\
  ');

  _util.simpleShader.call(this, gl.hueSaturation, {
    hue: (0, _util.clamp)(-1, hue, 1),
    saturation: (0, _util.clamp)(-1, saturation, 1)
  });

  return this;
};

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (amount) {
  var gl = store.get('gl');
  gl.noise = gl.noise || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float amount;\
    varying vec2 texCoord;\
    float rand(vec2 co) {\
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\
    }\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      \
      float diff = (rand(texCoord) - 0.5) * amount;\
      color.r += diff;\
      color.g += diff;\
      color.b += diff;\
      \
      gl_FragColor = color;\
    }\
  ');

  _util.simpleShader.call(this, gl.noise, {
    amount: (0, _util.clamp)(0, amount, 1)
  });

  return this;
};

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (amount) {
  var gl = store.get('gl');
  gl.sepia = gl.sepia || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float amount;\
    varying vec2 texCoord;\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      float r = color.r;\
      float g = color.g;\
      float b = color.b;\
      \
      color.r = min(1.0, (r * (1.0 - (0.607 * amount))) + (g * (0.769 * amount)) + (b * (0.189 * amount)));\
      color.g = min(1.0, (r * 0.349 * amount) + (g * (1.0 - (0.314 * amount))) + (b * 0.168 * amount));\
      color.b = min(1.0, (r * 0.272 * amount) + (g * 0.534 * amount) + (b * (1.0 - (0.869 * amount))));\
      \
      gl_FragColor = color;\
    }\
  ');

  _util.simpleShader.call(this, gl.sepia, {
    amount: (0, _util.clamp)(0, amount, 1)
  });

  return this;
};

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (amount) {
  var gl = store.get('gl');
  gl.vibrance = gl.vibrance || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float amount;\
    varying vec2 texCoord;\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      float average = (color.r + color.g + color.b) / 3.0;\
      float mx = max(color.r, max(color.g, color.b));\
      float amt = (mx - average) * (-amount * 3.0);\
      color.rgb = mix(color.rgb, vec3(mx), amt);\
      gl_FragColor = color;\
    }\
  ');

  _util.simpleShader.call(this, gl.vibrance, {
    amount: (0, _util.clamp)(-1, amount, 1)
  });

  return this;
};

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (size, amount) {
  var gl = store.get('gl');
  gl.vignette = gl.vignette || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform float size;\
    uniform float amount;\
    varying vec2 texCoord;\
    void main() {\
      vec4 color = texture2D(texture, texCoord);\
      \
      float dist = distance(texCoord, vec2(0.5, 0.5));\
      color.rgb *= smoothstep(0.8, size * 0.799, dist * (amount + size));\
      \
      gl_FragColor = color;\
    }\
  ');

  _util.simpleShader.call(this, gl.vignette, {
    size: (0, _util.clamp)(0, size, 1),
    amount: (0, _util.clamp)(0, amount, 1)
  });

  return this;
};

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _common = __webpack_require__(3);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _common = __webpack_require__(3);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (radius) {
  var gl = store.get('gl');
  gl.triangleBlur = gl.triangleBlur || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform vec2 delta;\
    varying vec2 texCoord;\
    ' + _common.randomShaderFunc + '\
    void main() {\
      vec4 color = vec4(0.0);\
      float total = 0.0;\
      \
      /* randomize the lookup values to hide the fixed number of samples */\
      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
      \
      for (float t = -30.0; t <= 30.0; t++) {\
        float percent = (t + offset - 0.5) / 30.0;\
        float weight = 1.0 - abs(percent);\
        vec4 sample = texture2D(texture, texCoord + delta * percent);\
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

  _util.simpleShader.call(this, gl.triangleBlur, {
    delta: [radius / this.width, 0]
  });
  _util.simpleShader.call(this, gl.triangleBlur, {
    delta: [0, radius / this.height]
  });

  return this;
};

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _common = __webpack_require__(3);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _common = __webpack_require__(3);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (centerX, centerY, angle, size) {
  var gl = store.get('gl');
  gl.colorHalftone = gl.colorHalftone || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform vec2 center;\
    uniform float angle;\
    uniform float scale;\
    uniform vec2 texSize;\
    varying vec2 texCoord;\
    \
    float pattern(float angle) {\
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
      vec3 cmy = 1.0 - color.rgb;\
      float k = min(cmy.x, min(cmy.y, cmy.z));\
      cmy = (cmy - k) / (1.0 - k);\
      cmy = clamp(cmy * 10.0 - 3.0 + vec3(pattern(angle + 0.26179), pattern(angle + 1.30899), pattern(angle)), 0.0, 1.0);\
      k = clamp(k * 10.0 - 5.0 + pattern(angle + 0.78539), 0.0, 1.0);\
      gl_FragColor = vec4(1.0 - cmy - k, color.a);\
    }\
  ');

  _util.simpleShader.call(this, gl.colorHalftone, {
    center: [centerX, centerY],
    angle: angle,
    scale: Math.PI / size,
    texSize: [this.width, this.height]
  });

  return this;
};

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _common = __webpack_require__(3);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (centerX, centerY, scale) {
  var gl = store.get('gl');
  gl.hexagonalPixelate = gl.hexagonalPixelate || new _shader2.default(null, '\
    uniform sampler2D texture;\
    uniform vec2 center;\
    uniform float scale;\
    uniform vec2 texSize;\
    varying vec2 texCoord;\
    void main() {\
      vec2 tex = (texCoord * texSize - center) / scale;\
      tex.y /= 0.866025404;\
      tex.x -= tex.y * 0.5;\
      \
      vec2 a;\
      if (tex.x + tex.y - floor(tex.x) - floor(tex.y) < 1.0) a = vec2(floor(tex.x), floor(tex.y));\
      else a = vec2(ceil(tex.x), ceil(tex.y));\
      vec2 b = vec2(ceil(tex.x), floor(tex.y));\
      vec2 c = vec2(floor(tex.x), ceil(tex.y));\
      \
      vec3 TEX = vec3(tex.x, tex.y, 1.0 - tex.x - tex.y);\
      vec3 A = vec3(a.x, a.y, 1.0 - a.x - a.y);\
      vec3 B = vec3(b.x, b.y, 1.0 - b.x - b.y);\
      vec3 C = vec3(c.x, c.y, 1.0 - c.x - c.y);\
      \
      float alen = length(TEX - A);\
      float blen = length(TEX - B);\
      float clen = length(TEX - C);\
      \
      vec2 choice;\
      if (alen < blen) {\
        if (alen < clen) choice = a;\
        else choice = c;\
      } else {\
        if (blen < clen) choice = b;\
        else choice = c;\
      }\
      \
      choice.x += choice.y * 0.5;\
      choice.y *= 0.866025404;\
      choice *= scale / texSize;\
      gl_FragColor = texture2D(texture, choice + center / texSize);\
    }\
  ');

  _util.simpleShader.call(this, gl.hexagonalPixelate, {
    center: [centerX, centerY],
    scale: scale,
    texSize: [this.width, this.height]
  });

  return this;
};

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var _shader = __webpack_require__(2);

var _shader2 = _interopRequireDefault(_shader);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (centerX, centerY, radius, strength) {
  var gl = store.get('gl');
  gl.bulgePinch = gl.bulgePinch || (0, _common.warpShader)('\
    uniform float radius;\
    uniform float strength;\
    uniform vec2 center;\
  ', '\
    coord -= center;\
    float distance = length(coord);\
    if (distance < radius) {\
      float percent = distance / radius;\
      if (strength > 0.0) {\
        coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\
      } else {\
        coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\
      }\
    }\
    coord += center;\
  ');

  _util.simpleShader.call(this, gl.bulgePinch, {
    radius: radius,
    strength: (0, _util.clamp)(-1, strength, 1),
    center: [centerX, centerY],
    texSize: [this.width, this.height]
  });

  return this;
};

var _common = __webpack_require__(3);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (matrix, inverse, useTextureSpace) {
  var gl = store.get('gl');
  gl.matrixWarp = gl.matrixWarp || (0, _common.warpShader)('\
    uniform mat3 matrix;\
    uniform bool useTextureSpace;\
  ', '\
    if (useTextureSpace) coord = coord / texSize * 2.0 - 1.0;\
    vec3 warp = matrix * vec3(coord, 1.0);\
    coord = warp.xy / warp.z;\
    if (useTextureSpace) coord = (coord * 0.5 + 0.5) * texSize;\
  ');

  // Flatten all members of matrix into one big list
  matrix = Array.prototype.concat.apply([], matrix);

  // Extract a 3x3 matrix out of the arguments
  if (matrix.length == 4) {
    matrix = [matrix[0], matrix[1], 0, matrix[2], matrix[3], 0, 0, 0, 1];
  } else if (matrix.length != 9) {
    throw 'can only warp with 2x2 or 3x3 matrix';
  }

  _util.simpleShader.call(this, gl.matrixWarp, {
    matrix: inverse ? (0, _matrix.getInverse)(matrix) : matrix,
    texSize: [this.width, this.height],
    useTextureSpace: useTextureSpace | 0
  });

  return this;
};

var _common = __webpack_require__(3);

var _matrix = __webpack_require__(4);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (before, after) {
  var a = _matrix.getSquareToQuad.apply(null, after);
  var b = _matrix.getSquareToQuad.apply(null, before);
  var c = (0, _matrix.multiply)((0, _matrix.getInverse)(a), b);
  return this.matrixWarp(c);
};

var _matrix = __webpack_require__(4);

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (centerX, centerY, radius, angle) {
  var gl = store.get('gl');
  gl.swirl = gl.swirl || (0, _common.warpShader)('\
    uniform float radius;\
    uniform float angle;\
    uniform vec2 center;\
  ', '\
    coord -= center;\
    float distance = length(coord);\
    if (distance < radius) {\
      float percent = (radius - distance) / radius;\
      float theta = percent * percent * angle;\
      float s = sin(theta);\
      float c = cos(theta);\
      coord = vec2(\
        coord.x * c - coord.y * s,\
        coord.x * s + coord.y * c\
      );\
    }\
    coord += center;\
  ');

  _util.simpleShader.call(this, gl.swirl, {
    radius: radius,
    center: [centerX, centerY],
    angle: angle,
    texSize: [this.width, this.height]
  });

  return this;
};

var _common = __webpack_require__(3);

var _util = __webpack_require__(1);

var _store = __webpack_require__(0);

var store = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ })
/******/ ]);
});
//# sourceMappingURL=glfx-es6.js.map