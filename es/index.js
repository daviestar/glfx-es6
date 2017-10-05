'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splineInterpolate = undefined;

var _util = require('./util');

Object.defineProperty(exports, 'splineInterpolate', {
  enumerable: true,
  get: function get() {
    return _util.splineInterpolate;
  }
});

var _store = require('./store');

var store = _interopRequireWildcard(_store);

var _texture = require('./texture');

var _texture2 = _interopRequireDefault(_texture);

var _shader = require('./shader');

var _shader2 = _interopRequireDefault(_shader);

var _filters = require('./filters');

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

exports.default = {
  canvas: function canvas() {
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
  }
};