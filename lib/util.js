'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simpleShader = simpleShader;
exports.clamp = clamp;
exports.splineInterpolate = splineInterpolate;

var _spline = require('./spline');

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