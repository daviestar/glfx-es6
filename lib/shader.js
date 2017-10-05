'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _store = require('./store');

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