import {warpShader} from '../common.js'
import {simpleShader} from '../../util.js'
import * as store from '../../store.js'

/**
 * @filter        Fisheye
 * @description   Warps a circular region of the image in a swirl.
 * @param centerX The x coordinate of the center of the circular region.
 * @param centerY The y coordinate of the center of the circular region.
 * @param strength  The strength of the circular region.
 * @param angle   The angle in radians that the pixels in the center of
 *                the circular region will be rotated by.
 */
export default function(centerX, centerY, strength, angle) {
  var gl = store.get('gl');
  gl.swirl = gl.swirl || warpShader(`
    uniform float strength;
    uniform float angle;
    uniform vec2 center;
  `, `
    vec2 coord0 = (coord - center)/texSize;
    float distance = pow(length(coord0), 2.0);
    coord = coord0 / (1.0 + strength * distance);
    coord = coord * texSize + center;
  `);

  simpleShader.call(this, gl.swirl, {
    strength: strength,
    center: [centerX, centerY],
    angle: angle,
    texSize: [this.width, this.height]
  });

  return this;
}
