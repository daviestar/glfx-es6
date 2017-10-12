This is a port of [glfx.js by Evan Wallace](http://www.github.com/evanw/glfx.js) to work with modern module importers.  The API is exactly the same.

### Installation

```shell
npm install glfx-es6 --save
```
```html
<script src="https://unpkg.com/glfx-es6/dist/glfx-es6.min.js"></script>
```

### Usage

```js
import * as fx from 'glfx-es6'

fx.canvas().replace(canvasElement)
// ...
```

Original documentation below:

# Overview

This library provides realtime image effects using WebGL. There are three parts to glfx.js:

- **texture:** a raw source of image data (created from an `<img>` tag)
- **filter:** an image effect (represents one or more WebGL shaders)
- **canvas:** an image buffer that stores the results (a WebGL `<canvas>` tag)

There are two caveats to glfx.js. First, WebGL is a new technology that is only available in the latest browsers and it will be quite a while before the majority of users have it. Second, due to the same origin policy, JavaScript is only allowed to read images that originate from the same domain as the script reading them, so you may have to host the images you modify.

# Quick Start

This HTML fragment is all you need to use the API. Copy and paste it into an empty index.html document, make sure that directory also contains `glfx.js` and an image named <a href="../media/image.jpg">image.jpg</a>, and open index.html. You should see the image with the ink filter applied.

```js
window.onload = function() {
  
  // try to create a WebGL canvas (will fail if WebGL isn't supported)
  try {
    var canvas = fx.canvas();
  } catch (e) {
    alert(e);
    return;
  }

  // convert the image to a texture
  var image = document.getElementById('image');
  var texture = canvas.texture(image);

  // apply the ink filter
  canvas.draw(texture).ink(0.25).update();

  // replace the image with the canvas
  image.parentNode.insertBefore(canvas, image);
  image.parentNode.removeChild(image);

  // Note: instead of swapping the <canvas> tag with the <img> tag
  // as done above, we could have just transferred the contents of
  // the image directly:
  //
  // image.src = canvas.toDataURL('image/png');
  //
  // This has two disadvantages. First, it is much slower, so it
  // would be a bad idea to do this repeatedly. If you are going
  // to be repeatedly updating a filter it's much better to use
  // the <canvas> tag directly. Second, this requires that the
  // image is hosted on the same domain as the script because
  // JavaScript has direct access to the image contents. When the
  // two tags were swapped using the previous method, JavaScript
  // actually doesn't have access to the image contents and this
  // does not violate the same origin policy.

};
```

```html
<img id="image" src="image.jpg">
<script src="glfx.js"></script>
```

# Core API

## Canvas Constructor

```js
var canvas = fx.canvas()
```

Before you can apply any filters you will need a canvas, which stores the result of the filters you apply. Canvas creation is done through `fx.canvas()`, which creates and returns a new WebGL `<canvas>` tag with additional methods specific to glfx.js. This call will throw an error message if the browser doesn't support WebGL.

### Draw Image

```js
canvas.draw(texture);
```

This replaces the internal contents of the canvas with the image stored in `texture`. All filter operations take place in a chain that starts with `canvas.draw()` and ends with `canvas.update()`.

| Argument | Description |
| :--- | :--- |
| texture | Stores image data, the result of calling `fx.texture()`. |

### Update Screen

```js
canvas.update();
```

This replaces the visible contents of the canvas with the internal image result. For efficiency reasons, the internal image buffers are not rendered to the screen every time a filter is applied, so you will need to call `update()` on your canvas after you have finished applying the filters to be able to see the result. All filter operations take place in a chain that starts with `canvas.draw()` and ends with `canvas.update()`.

## Texture Constructor

```js
var texture = canvas.texture(element);
```

Creates a texture that initially stores the image from an HTML element. Notice that `texture()` is a method on a canvas object, which means if you want to use the same image on two canvas objects you will need two different textures, one for each canvas.

| Argument | Description |
| :--- | :--- |
| element | The HTML element to store in the texture, either an `<img>`, a `<canvas>`, or a `<video>`. |

### Update Texture

```js
texture.loadContentsOf(element);
```

Loads the image from an HTML element into the texture. This is more efficient than repeatedly creating and destroying textures.

| Argument | Description |
| :--- | :--- |
| element | The HTML element to store in the texture, either an `<img>`, a `<canvas>`, or a `<video>`. |

### Destroy Texture

```js
texture.destroy();
```

Textures will be garbage collected eventually when they are no longer referenced, but this method will free GPU resources immediately.

# Filters

All filters are methods on a canvas object and modify the image that is currently on the canvas. This means you will have to `draw()` a texture on the canvas before you can apply a filter to it. For efficiency reasons, the internal image buffers are not rendered to the screen every time a filter is applied, so you will need to call `update()` on your canvas after you have finished applying the filters to be able to see the result. For an example, please see the [Quick Start](#quick-start) section above.

### Brightness / Contrast ([demo](http://evanw.github.io/glfx.js/demo/#brightnessContrast))

```js
canvas.brightnessContrast(brightness, contrast);
```

Provides additive brightness and multiplicative contrast control.

| Argument | Description |
| :--- | :--- |
| brightness | -1 to 1 (-1 is solid black, 0 is no change, and 1 is solid white) |
| contrast | -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast) |
  
### Curves

```js
canvas.curves(red, green, blue);
```

A powerful mapping tool that transforms the colors in the image by an arbitrary function. The function is interpolated between a set of 2D points using splines. The curves filter can take either one or three arguments which will apply the mapping to either luminance or RGB values, respectively.

| Argument | Description |
| :--- | :--- |
| red | A list of points that define the function for the red channel. Each point is a list of two values: the value before the mapping and the value after the mapping, both in the range 0 to 1. For example, `[[0,1], [1,0]]` would invert the red channel while `[[0,0], [1,1]]` would leave the red channel unchanged. If green and blue are omitted then this argument also applies to the green and blue channels. |
| green | (optional) A list of points that define the function for the green channel (just like for red). |
| blue | (optional) A list of points that define the function for the blue channel (just like for red). |

### Denoise ([demo](http://evanw.github.io/glfx.js/demo/#denoise))

```js
canvas.denoise(exponent);
```

Smooths over grainy noise in dark images using an 9x9 box filter weighted by color intensity, similar to a bilateral filter.

| Argument | Description |
| :--- | :--- |
| exponent | The exponent of the color intensity difference, should be greater than zero. A value of zero just gives an 9x9 box blur and high values give the original image, but ideal values are usually around 10-20. |

### Hue / Saturation ([demo](http://evanw.github.io/glfx.js/demo/#hueSaturation))

```js
canvas.hueSaturation(hue, saturation);
```

Provides rotational hue and multiplicative saturation control. RGB color space can be imagined as a cube where the axes are the red, green, and blue color values. Hue changing works by rotating the color vector around the grayscale line, which is the straight line from black `(0, 0, 0)` to white `(1, 1, 1)`. Saturation is implemented by scaling all color channel values either toward or away from the average color channel value.

| Argument | Description |
| :--- | :--- |
| hue | -1 to 1 (-1 is 180 degree rotation in the negative direction, 0 is no change, and 1 is 180 degree rotation in the positive direction) |
| saturation | -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast) |

### Noise ([demo](http://evanw.github.io/glfx.js/demo/#noise))

```js
canvas.noise(amount);
```

Adds black and white noise to the image.

| Argument | Description |
| :--- | :--- |
| amount | 0 to 1 (0 for no effect, 1 for maximum noise) |

### Sepia ([demo](http://evanw.github.io/glfx.js/demo/#sepia))

```js
canvas.sepia(amount);
```

Gives the image a reddish-brown monochrome tint that imitates an old photograph.

| Argument | Description |
| :--- | :--- |
| amount | 0 to 1 (0 for no effect, 1 for full sepia coloring) |

### Unsharp Mask ([demo](http://evanw.github.io/glfx.js/demo/#unsharpMask))

```js
canvas.unsharpMask(radius, strength);
```

A form of image sharpening that amplifies high-frequencies in the image. It is implemented by scaling pixels away from the average of their neighbors.

| Argument | Description |
| :--- | :--- |
| radius | The blur radius that calculates the average of the neighboring pixels. |
| strength | A scale factor where 0 is no effect and higher values cause a stronger effect. |

### Vibrance ([demo](http://evanw.github.io/glfx.js/demo/#vibrance))

```js
canvas.vibrance(amount);
```

Modifies the saturation of desaturated colors, leaving saturated colors unmodified.

| Argument | Description |
| :--- | :--- |
| amount | -1 to 1 (-1 is minimum vibrance, 0 is no change, and 1 is maximum vibrance) |

### Vignette ([demo](http://evanw.github.io/glfx.js/demo/#vignette))

```js
canvas.vignette(size, amount);
```

Adds a simulated lens edge darkening effect.

| Argument | Description |
| :--- | :--- |
| size | 0 to 1 (0 for center of frame, 1 for edge of frame) |
| amount | 0 to 1 (0 for no effect, 1 for maximum lens darkening) |

### Lens Blur ([demo](http://evanw.github.io/glfx.js/demo/#lensBlur))

```js
canvas.lensBlur(radius, brightness, angle);
```

Imitates a camera capturing the image out of focus by using a blur that generates the large shapes known as bokeh. The polygonal shape of real bokeh is due to the blades of the aperture diaphragm when it isn't fully open. This blur renders bokeh from a 6-bladed diaphragm because the computation is more efficient. It can be separated into three rhombi, each of which is just a skewed box blur. This filter makes use of the floating point texture WebGL extension to implement the brightness parameter, so there will be severe visual artifacts if brightness is non-zero and the floating point texture extension is not available. The idea was from John White's SIGGRAPH 2011 talk but this effect has an additional brightness parameter that fakes what would otherwise come from a HDR source.

| Argument | Description |
| :--- | :--- |
| radius | the radius of the hexagonal disk convolved with the image |
| brightness | -1 to 1 (the brightness of the bokeh, negative values will create dark bokeh) |
| angle | the rotation of the bokeh in radians |

### Tilt Shift ([demo](http://evanw.github.io/glfx.js/demo/#tiltShift))

```js
canvas.tiltShift(startX, startY, endX, endY, blurRadius, gradientRadius);
```

Simulates the shallow depth of field normally encountered in close-up photography, which makes the scene seem much smaller than it actually is. This filter assumes the scene is relatively planar, in which case the part of the scene that is completely in focus can be described by a line (the intersection of the focal plane and the scene). An example of a planar scene might be looking at a road from above at a downward angle. The image is then blurred with a blur radius that starts at zero on the line and increases further from the line.

| Argument | Description |
| :--- | :--- |
| startX | The x coordinate of the start of the line segment. |
| startY | The y coordinate of the start of the line segment. |
| endX | The x coordinate of the end of the line segment. |
| endY | The y coordinate of the end of the line segment. |
| blurRadius | The maximum radius of the pyramid blur. |
| gradientRadius | The distance from the line at which the maximum blur radius is reached. |

### Triangle Blur ([demo](http://evanw.github.io/glfx.js/demo/#triangleBlur))

```js
canvas.triangleBlur(radius);
```

This is the most basic blur filter, which convolves the image with a pyramid filter. The pyramid filter is separable and is applied as two perpendicular triangle filters.

| Argument | Description |
| :--- | :--- |
| radius | The radius of the pyramid convolved with the image. |

### Zoom Blur ([demo](http://evanw.github.io/glfx.js/demo/#zoomBlur))

```js
canvas.zoomBlur(centerX, centerY, strength);
```

Blurs the image away from a certain point, which looks like radial motion blur.

| Argument | Description |
| :--- | :--- |
| centerX | The x coordinate of the blur origin. |
| centerY | The y coordinate of the blur origin. |
| strength | The strength of the blur. Values in the range 0 to 1 are usually sufficient, where 0 doesn't change the image and 1 creates a highly blurred image. |

### Color Halftone ([demo](http://evanw.github.io/glfx.js/demo/#colorHalftone))

```js
canvas.colorHalftone(centerX, centerY, angle, size);
```

Simulates a CMYK halftone rendering of the image by multiplying pixel values with a four rotated 2D sine wave patterns, one each for cyan, magenta, yellow, and black.

| Argument | Description |
| :--- | :--- |
| centerX | The x coordinate of the pattern origin. |
| centerY | The y coordinate of the pattern origin. |
| angle | The rotation of the pattern in radians. |
| size | The diameter of a dot in pixels. |

### Dot Screen ([demo](http://evanw.github.io/glfx.js/demo/#dotScreen))

```js
canvas.dotScreen(centerX, centerY, angle, size);
```

Simulates a black and white halftone rendering of the image by multiplying pixel values with a rotated 2D sine wave pattern.

| Argument | Description |
| :--- | :--- |
| centerX | The x coordinate of the pattern origin. |
| centerY | The y coordinate of the pattern origin. |
| angle | The rotation of the pattern in radians. |
| size | The diameter of a dot in pixels. |

### Edge Work ([demo](http://evanw.github.io/glfx.js/demo/#edgeWork))

```js
canvas.edgeWork(radius);
```

Picks out different frequencies in the image by subtracting two copies of the image blurred with different radii.

| Argument | Description |
| :--- | :--- |
| radius | The radius of the effect in pixels. |

### Hexagonal Pixelate ([demo](http://evanw.github.io/glfx.js/demo/#hexagonalPixelate))

```js
canvas.hexagonalPixelate(centerX, centerY, scale);
```

Renders the image using a pattern of hexagonal tiles. Tile colors are nearest-neighbor sampled from the centers of the tiles.

| Argument | Description |
| :--- | :--- |
| centerX | The x coordinate of the pattern center. |
| centerY | The y coordinate of the pattern center. |
| scale | The width of an individual tile, in pixels. |

### Ink ([demo](http://evanw.github.io/glfx.js/demo/#ink))

```js
canvas.ink(strength);
```

Simulates outlining the image in ink by darkening edges stronger than a certain threshold. The edge detection value is the difference of two copies of the image, each blurred using a blur of a different radius.

| Argument | Description |
| :--- | :--- |
| strength | The multiplicative scale of the ink edges. Values in the range 0 to 1 are usually sufficient, where 0 doesn't change the image and 1 adds lots of black edges. Negative strength values will create white ink edges instead of black ones.

### Bulge / Pinch ([demo](http://evanw.github.io/glfx.js/demo/#bulgePinch))

```js
canvas.bulgePinch(centerX, centerY, radius, strength);
```

Bulges or pinches the image in a circle.

| Argument | Description |
| :--- | :--- |
| centerX | The x coordinate of the center of the circle of effect. |
| centerY | The y coordinate of the center of the circle of effect. |
| radius | The radius of the circle of effect. |
| strength | -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge) |

### Matrix Warp

```js
canvas.matrixWarp(matrix, inverse, useTextureSpace);
```

Transforms an image by a 2x2 or 3x3 matrix. The coordinates used in the transformation are `(x, y)` for a 2x2 matrix or `(x, y, 1)` for a 3x3 matrix, where x and y are in units of pixels.

| Argument | Description |
| :--- | :--- |
| matrix | A 2x2 or 3x3 matrix represented as either a list or a list of lists. For example, the 3x3 matrix `[[2,0,0],[0,3,0],[0,0,1]]` can also be represented as `[2,0,0,0,3,0,0,0,1]` or just `[2,0,0,3]`. |
| inverse | A boolean value that, when true, applies the inverse transformation instead. (optional, defaults to false) |
| useTextureSpace | A boolean value that, when true, uses texture-space coordinates instead of screen-space coordinates. Texture-space coordinates range from -1 to 1 instead of 0 to width - 1 or height - 1, and are easier to use for simple operations like flipping and rotating. |

### Perspective ([demo](http://evanw.github.io/glfx.js/demo/#perspective))

```js
canvas.perspective(before, after);
```

Warps one quadrangle to another with a perspective transform. This can be used to make a 2D image look 3D or to recover a 2D image captured in a 3D environment.

| Argument | Description |
| :--- | :--- |
| before | The x and y coordinates of four points before the transform in a flat list. This would look like `[ax, ay, bx, by, cx, cy, dx, dy]` for four points (ax, ay), (bx, by), (cx, cy), and (dx, dy). |
| after | The x and y coordinates of four points after the transform in a flat list, just like the other argument. |

### Swirl ([demo](http://evanw.github.io/glfx.js/demo/#swirl))

```js
canvas.swirl(centerX, centerY, radius, angle);
```

Warps a circular region of the image in a swirl.

| Argument | Description |
| :--- | :--- |
| centerX | The x coordinate of the center of the circular region. |
| centerY | The y coordinate of the center of the circular region. |
| radius | The radius of the circular region. |
| angle | The angle in radians that the pixels in the center of the circular region will be rotated by. |
